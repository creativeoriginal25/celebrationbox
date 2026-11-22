import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Upload,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { AdminProduct, OccasionCategory, ThemeOption } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../../services/adminService';

interface AdminProductsProps {
  products: AdminProduct[];
  categories: OccasionCategory[];
  themes: ThemeOption[];
  onRefresh: () => void;
  isInitialAddOpen?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  themes,
  onRefresh,
  isInitialAddOpen = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isInitialAddOpen);
  const [previewProduct, setPreviewProduct] = useState<AdminProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<{
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    ideal_for: string;
    selling_price: number;
    material_cost: number;
    packaging_cost: number;
    other_variable_cost: number;
    category_id: string;
    theme_id: string;
    stock_quantity: number;
    status: 'active' | 'draft' | 'out_of_stock' | 'archived';
    total_pieces: number;
    badge: string;
    images: { url: string; alt?: string; title?: string; caption?: string }[];
    contents: { name: string; quantity: string; pieceCount?: number; specification?: string }[];
    exclusions: string[];
  }>({
    id: '',
    slug: '',
    name: '',
    tagline: 'Big Moments. One Little Box.',
    description: '',
    ideal_for: 'Hostel rooms, living rooms, and bedroom celebrations',
    selling_price: 399,
    material_cost: 140,
    packaging_cost: 35,
    other_variable_cost: 15,
    category_id: categories[0]?.id || 'kids-birthday',
    theme_id: themes[0]?.id || 'pastel-rose',
    stock_quantity: 50,
    status: 'active',
    total_pieces: 60,
    badge: 'Popular',
    images: [],
    contents: [
      { name: 'Pink Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch Natural Latex' },
      { name: 'Lavender Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch Natural Latex' },
      { name: 'Rose Gold Chrome Balloons', quantity: '5 pcs', pieceCount: 5, specification: '12-inch Metallic Chrome' },
      { name: 'Rose Gold Happy Birthday Banner', quantity: '1 pc', pieceCount: 1, specification: 'Pre-strung banner' },
      { name: 'Balloon Arch Strip', quantity: '1 pc', pieceCount: 1, specification: '5m double-hole strip' },
      { name: 'Glue Dot Roll', quantity: '1 roll', pieceCount: 1, specification: '100 removable dots' },
    ],
    exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
  });

  const [newContentItem, setNewContentItem] = useState({ name: '', quantity: '1 pc', specification: '' });
  const [newExclusion, setNewExclusion] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `box-${Date.now().toString().slice(-4)}`,
      slug: '',
      name: '',
      tagline: 'Big Moments. One Little Box.',
      description: 'Everything you need to turn an ordinary space into a beautiful celebration moment.',
      ideal_for: 'Hostel rooms, living rooms, and bedroom celebrations',
      selling_price: 399,
      material_cost: 140,
      packaging_cost: 35,
      other_variable_cost: 15,
      category_id: categories[0]?.id || 'kids-birthday',
      theme_id: themes[0]?.id || 'pastel-rose',
      stock_quantity: 50,
      status: 'active',
      total_pieces: 60,
      badge: 'New',
      images: [],
      contents: [
        { name: 'Pink Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch' },
        { name: 'Lavender Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch' },
        { name: 'Rose Gold Chrome Balloons', quantity: '5 pcs', pieceCount: 5, specification: '12-inch' },
        { name: 'Rose Gold Banner', quantity: '1 pc', pieceCount: 1, specification: 'Script script' },
        { name: 'Balloon Arch Strip', quantity: '1 pc', pieceCount: 1, specification: '5m' },
        { name: 'Glue Dot Roll', quantity: '1 roll', pieceCount: 1, specification: '100 dots' },
      ],
      exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      ideal_for: product.ideal_for || '',
      selling_price: product.selling_price,
      material_cost: product.material_cost,
      packaging_cost: product.packaging_cost,
      other_variable_cost: product.other_variable_cost,
      category_id: product.category_id,
      theme_id: product.theme_id,
      stock_quantity: product.stock_quantity,
      status: product.status,
      total_pieces: product.total_pieces,
      badge: product.badge || '',
      images: [...product.images],
      contents: [...product.contents],
      exclusions: [...product.exclusions],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    if (formData.selling_price <= 0) {
      setFormError('Selling price must be greater than zero.');
      return;
    }

    if (formData.images.length === 0) {
      setFormError('Please add at least one product photograph.');
      return;
    }

    const calculatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...formData,
          slug: calculatedSlug,
        });
      } else {
        await createProduct({
          ...formData,
          id: formData.id || calculatedSlug,
          slug: calculatedSlug,
        });
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save product record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete or archive "${name}"?`)) {
      await deleteProduct(id);
      onRefresh();
    }
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: imageUrlInput.trim(),
          title: `Image ${prev.images.length + 1}`,
          caption: prev.name || 'Celebration Kit',
        },
      ],
    }));
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url,
            title: prev.images.length === 0 ? 'Decoration Setup' : "What's Inside the Box",
            caption: file.name,
          },
        ],
      }));
    } catch (err) {
      alert('Failed to upload image. Please try entering an image URL.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= imgs.length) return prev;
      const temp = imgs[index];
      imgs[index] = imgs[targetIndex];
      imgs[targetIndex] = temp;
      return { ...prev, images: imgs };
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddContent = () => {
    if (!newContentItem.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      contents: [...prev.contents, { ...newContentItem }],
    }));
    setNewContentItem({ name: '', quantity: '1 pc', specification: '' });
  };

  const handleRemoveContent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index),
    }));
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    setFormData((prev) => ({
      ...prev,
      exclusions: [...prev.exclusions, newExclusion.trim()],
    }));
    setNewExclusion('');
  };

  const handleRemoveExclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }));
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category_id === filterCategory;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Product Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage DIY celebration boxes, photographs, contents, and real-time inventory status.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-pink"
        />

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Variable Cost</th>
                <th className="py-3 px-4">Contribution</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalCost =
                    Number(p.material_cost || 0) +
                    Number(p.packaging_cost || 0) +
                    Number(p.other_variable_cost || 0);
                  const contribution = Number(p.selling_price || 0) - totalCost;
                  const marginPct =
                    p.selling_price > 0 ? ((contribution / p.selling_price) * 100).toFixed(0) : '0';

                  const categoryObj = categories.find((c) => c.id === p.category_id);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]?.url || '/products/pastel-rose-setup.jpg'}
                            alt={p.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-200 shrink-0 p-0.5"
                          />
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              {p.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-50 text-brand-pink border border-pink-100">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {p.tagline}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {categoryObj?.name || p.category_id}
                      </td>

                      <td className="py-3.5 px-4 font-black text-brand-pink">
                        {formatPrice(p.selling_price)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {formatPrice(totalCost)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-teal">
                          {formatPrice(contribution)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ({marginPct}% margin)
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            p.stock_quantity <= 10 ? 'text-amber-600' : 'text-slate-700'
                          }`}
                        >
                          {p.stock_quantity} units
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : p.status === 'draft'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-brand-teal rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Preview customer card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-brand-pink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete or archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRODUCT CREATE / EDIT MODAL                                    */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-black text-brand-ink font-display">
                {editingProduct ? 'Edit Celebration Box' : 'Create New Celebration Box'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{formError}</p>
                </div>
              )}

              {/* 1. Basic Details */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  1. Product Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Name <span className="text-brand-pink">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pastel Rose Celebration Box"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Slug (URL Identifier)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. pastel-rose-box"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder='e.g. "Big Moments. One Little Box."'
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Best Seller / Popular"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description for product cards and details."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              {/* 2. Pricing & Cost Economics */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  2. Pricing & Unit Costs (₹)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Selling Price <span className="text-brand-pink">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink font-bold text-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Material Cost
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.material_cost}
                      onChange={(e) => setFormData({ ...formData, material_cost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Packaging Cost
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.packaging_cost}
                      onChange={(e) => setFormData({ ...formData, packaging_cost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Other Costs
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.other_variable_cost}
                      onChange={(e) => setFormData({ ...formData, other_variable_cost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Estimated Contribution per Kit:</span>
                  <span className="font-black text-brand-teal text-sm">
                    {formatPrice(
                      formData.selling_price -
                        (formData.material_cost + formData.packaging_cost + formData.other_variable_cost)
                    )}
                  </span>
                </div>
              </div>

              {/* 3. Category, Theme, and Status */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  3. Classification & Stock
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Occasion</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Theme</label>
                    <select
                      value={formData.theme_id}
                      onChange={(e) => setFormData({ ...formData, theme_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Product Photographs & Gallery Ordering */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    4. Product Photographs (Image 1 = Main Setup, Image 2 = Inclusions Infographic)
                  </h3>
                  <span className="text-[11px] text-slate-400">{formData.images.length} images</span>
                </div>

                {/* Upload or Add URL Input */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    placeholder="Enter image URL (/products/setup.jpg or https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Add URL
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer border border-slate-200 transition-colors">
                    <Upload className="w-4 h-4 text-brand-pink" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>

                {/* Image List Preview with Reordering */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl border border-slate-200 p-2 bg-slate-50 flex flex-col justify-between group"
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center border border-slate-100">
                          <img
                            src={img.url}
                            alt={img.alt || `Product image ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-bold">
                            {idx === 0 ? 'Image 1 (Main)' : `Image ${idx + 1}`}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'up')}
                              className="p-1 hover:text-slate-800 disabled:opacity-30"
                              title="Move forward"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.images.length - 1}
                              onClick={() => handleMoveImage(idx, 'down')}
                              className="p-1 hover:text-slate-800 disabled:opacity-30"
                              title="Move backward"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. What's Inside the Box (Inclusions with Quantities) */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    5. What's Inside the Box (Exact Kit Inclusions)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {formData.contents.length} items
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. Pink Latex Balloons)"
                    value={newContentItem.name}
                    onChange={(e) => setNewContentItem({ ...newContentItem, name: e.target.value })}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Qty (e.g. 26 pcs)"
                    value={newContentItem.quantity}
                    onChange={(e) => setNewContentItem({ ...newContentItem, quantity: e.target.value })}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Specification (e.g. 12-inch)"
                    value={newContentItem.specification}
                    onChange={(e) => setNewContentItem({ ...newContentItem, specification: e.target.value })}
                    className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddContent}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5">
                  {formData.contents.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="font-bold text-brand-pink">({item.quantity})</span>
                        {item.specification && (
                          <span className="text-[11px] text-slate-400">— {item.specification}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveContent(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Exclusions Note */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  6. Honest Exclusions
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Cake, backdrop curtain, and balloon pump are not included."
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddExclusion}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1">
                  {formData.exclusions.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-900 flex items-center justify-between"
                    >
                      <span>{ex}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(idx)}
                        className="text-amber-700 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PRODUCT PREVIEW MODAL                                          */}
      {/* ============================================================== */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/65 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setPreviewProduct(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink bg-pink-50 px-2 py-0.5 rounded-full inline-block mb-3">
              Customer Card Preview
            </span>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 p-3 border border-slate-100 mb-4 flex items-center justify-center">
              <img
                src={previewProduct.images?.[0]?.url || '/products/pastel-rose-setup.jpg'}
                alt={previewProduct.name}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-xl font-extrabold text-brand-ink mb-1 font-display">
              {previewProduct.name}
            </h3>
            <p className="text-xs font-semibold text-brand-teal mb-3">{previewProduct.tagline}</p>

            <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-slate-100">
              <span className="text-2xl font-black text-brand-pink">
                {formatPrice(previewProduct.selling_price)}
              </span>
              <span className="text-xs text-slate-400">all inclusive</span>
            </div>

            <div className="space-y-1.5 mb-5 text-xs text-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                What's Inside ({previewProduct.contents?.length || 0} items):
              </span>
              {previewProduct.contents?.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {c.name} ({c.quantity})
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="py-2.5 text-center text-xs font-bold text-white bg-brand-pink rounded-xl">
                Buy Now
              </div>
              <div className="py-2.5 text-center text-xs font-bold text-brand-ink bg-slate-50 border border-slate-200 rounded-xl">
                Add to Cart
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
