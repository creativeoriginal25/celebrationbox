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
  Star,
  CheckCircle2,
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
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState<{
    id: string;
    slug: string;
    sku: string;
    name: string;
    tagline: string;
    description: string;
    selling_price: number;
    compare_at_price: number | '';
    material_cost: number;
    packaging_cost: number;
    other_variable_cost: number;
    category_ids: string[];
    theme_id: string;
    stock_quantity: number;
    status: 'published' | 'draft' | 'archived';
    badge: string;
    images: { url: string; alt: string; title: string; is_primary: boolean }[];
    contents: { name: string; quantity: string; unit: string; specification: string }[];
    exclusions: string[];
  }>({
    id: '',
    slug: '',
    sku: '',
    name: '',
    tagline: 'Big Moments. One Little Box.',
    description: 'Everything you need to turn an ordinary space into a beautiful birthday moment.',
    selling_price: 299,
    compare_at_price: 399,
    material_cost: 110,
    packaging_cost: 30,
    other_variable_cost: 10,
    category_ids: ['kids-birthday', 'adults-birthday'],
    theme_id: themes[0]?.id || 'pastel-rose',
    stock_quantity: 50,
    status: 'published',
    badge: 'Best Seller',
    images: [
      {
        url: '/products/pastel-rose-setup.jpg',
        alt: 'Pastel Rose Celebration Box - Decoration Setup',
        title: 'Decoration Setup',
        is_primary: true,
      },
      {
        url: '/products/pastel-rose-contents.jpg',
        alt: 'Pastel Rose Celebration Box - Package Contents',
        title: "What's Inside the Box",
        is_primary: false,
      },
    ],
    contents: [
      { name: 'Pink Latex Balloons', quantity: '26', unit: 'pcs', specification: '12-inch Natural Latex' },
      { name: 'Lavender Latex Balloons', quantity: '26', unit: 'pcs', specification: '12-inch Natural Latex' },
      { name: 'Rose Gold Chrome Balloons', quantity: '5', unit: 'pcs', specification: '12-inch Metallic Chrome' },
      { name: 'Rose Gold Happy Birthday Banner', quantity: '1', unit: 'pc', specification: 'Pre-strung script banner' },
      { name: 'Balloon Arch Strip', quantity: '1', unit: 'pc', specification: '5m double-hole strip' },
      { name: 'Glue Dot Roll', quantity: '1', unit: 'roll', specification: '100 removable dots' },
    ],
    exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
  });

  const [newContentItem, setNewContentItem] = useState({
    name: '',
    quantity: '1',
    unit: 'pc',
    specification: '',
  });
  const [newExclusion, setNewExclusion] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      slug: '',
      sku: `CB-${Date.now().toString().slice(-6)}`,
      name: '',
      tagline: 'Big Moments. One Little Box.',
      description: 'Everything you need to turn an ordinary space into a beautiful birthday moment.',
      selling_price: 299,
      compare_at_price: 399,
      material_cost: 110,
      packaging_cost: 30,
      other_variable_cost: 10,
      category_ids: ['kids-birthday'],
      theme_id: themes[0]?.id || 'pastel-rose',
      stock_quantity: 50,
      status: 'published',
      badge: 'New',
      images: [],
      contents: [
        { name: 'Pink Latex Balloons', quantity: '26', unit: 'pcs', specification: '12-inch Natural Latex' },
        { name: 'Lavender Latex Balloons', quantity: '26', unit: 'pcs', specification: '12-inch Natural Latex' },
        { name: 'Rose Gold Chrome Balloons', quantity: '5', unit: 'pcs', specification: '12-inch Metallic Chrome' },
        { name: 'Rose Gold Happy Birthday Banner', quantity: '1', unit: 'pc', specification: 'Pre-strung script banner' },
        { name: 'Balloon Arch Strip', quantity: '1', unit: 'pc', specification: '5m double-hole strip' },
        { name: 'Glue Dot Roll', quantity: '1', unit: 'roll', specification: '100 removable dots' },
      ],
      exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    const primaryCat = product.category_id || 'kids-birthday';
    const assignedCats = (product as any).categories || [primaryCat];

    setFormData({
      id: product.id,
      slug: product.slug,
      sku: (product as any).sku || `CB-${product.slug?.toUpperCase().slice(0, 8) || 'BOX'}`,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      selling_price: product.selling_price,
      compare_at_price: (product as any).compare_at_price || '',
      material_cost: product.material_cost || 110,
      packaging_cost: product.packaging_cost || 30,
      other_variable_cost: product.other_variable_cost || 10,
      category_ids: assignedCats,
      theme_id: product.theme_id || themes[0]?.id || 'pastel-rose',
      stock_quantity: product.stock_quantity ?? 50,
      status:
        product.status === 'published' || (product.status as any) === 'active'
          ? 'published'
          : (product.status as any) === 'archived'
          ? 'archived'
          : 'draft',
      badge: product.badge || '',
      images: (product.images || []).map((img, idx) => ({
        url: img.url,
        alt: img.alt || product.name,
        title: img.title || (idx === 0 ? 'Main Setup' : "What's Inside"),
        is_primary: idx === 0,
      })),
      contents: (product.contents || []).map((c) => ({
        name: c.name,
        quantity: c.quantity.replace(/[^\d]/g, '') || '1',
        unit: c.quantity.replace(/[\d\s]/g, '') || 'pcs',
        specification: c.specification || '',
      })),
      exclusions: [...(product.exclusions || [])],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (overrideStatus?: 'published' | 'draft' | 'archived') => {
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
      setFormError('Please add at least one product photograph before publishing.');
      return;
    }

    if (formData.category_ids.length === 0) {
      setFormError('Please select at least one celebration category.');
      return;
    }

    const calculatedSlug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const finalStatus = overrideStatus || formData.status;

    setIsSubmitting(true);
    try {
      const productPayload: any = {
        name: formData.name.trim(),
        slug: calculatedSlug,
        sku: formData.sku.trim() || `CB-${calculatedSlug.toUpperCase().slice(0, 8)}`,
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        selling_price: Number(formData.selling_price),
        compare_at_price:
          formData.compare_at_price !== '' ? Number(formData.compare_at_price) : undefined,
        material_cost: Number(formData.material_cost),
        packaging_cost: Number(formData.packaging_cost),
        other_variable_cost: Number(formData.other_variable_cost),
        category_id: formData.category_ids[0],
        categories: formData.category_ids,
        theme_id: formData.theme_id,
        stock_quantity: Number(formData.stock_quantity),
        status: finalStatus,
        total_pieces: formData.contents.reduce(
          (sum, c) => sum + (parseInt(c.quantity, 10) || 1),
          0
        ),
        badge: formData.badge,
        images: formData.images.map((img, idx) => ({
          url: img.url,
          alt: img.alt || formData.name,
          title: img.title || (idx === 0 ? 'Decoration Setup' : "What's Inside the Box"),
          is_primary: img.is_primary,
          sort_order: idx + 1,
        })),
        contents: formData.contents.map((c, idx) => ({
          name: c.name,
          quantity: `${c.quantity} ${c.unit}`.trim(),
          pieceCount: parseInt(c.quantity, 10) || 1,
          specification: c.specification,
          sort_order: idx + 1,
        })),
        exclusions: formData.exclusions,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
        showNotification(`Updated "${formData.name}" successfully!`);
      } else {
        await createProduct(productPayload);
        showNotification(
          finalStatus === 'published'
            ? `Published "${formData.name}" to live store!`
            : `Saved "${formData.name}" as draft.`
        );
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
      showNotification(`Deleted "${name}"`);
      onRefresh();
    }
  };

  const handleTogglePublish = async (p: AdminProduct) => {
    const newStatus =
      p.status === 'published' || (p.status as any) === 'active' ? 'draft' : 'published';
    await updateProduct(p.id, { status: newStatus as any });
    showNotification(
      newStatus === 'published'
        ? `Published "${p.name}" to live store!`
        : `Unpublished "${p.name}". Hidden from customer store.`
    );
    onRefresh();
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: imageUrlInput.trim(),
          alt: prev.name || 'Celebration Kit',
          title: prev.images.length === 0 ? 'Decoration Setup' : "What's Inside the Box",
          is_primary: prev.images.length === 0,
        },
      ],
    }));
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            url,
            alt: prev.name || file.name,
            title: prev.images.length === 0 ? 'Decoration Setup' : "What's Inside the Box",
            is_primary: prev.images.length === 0,
          },
        ],
      }));
      showNotification('Photo uploaded successfully to storage!');
    } catch (err: any) {
      alert(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => {
      const imgs = prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }));
      // Move primary image to index 0
      const primary = imgs.splice(index, 1)[0];
      imgs.unshift(primary);
      return { ...prev, images: imgs };
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const imgs = [...prev.images];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= imgs.length) return prev;
      const temp = imgs[index];
      imgs[index] = imgs[targetIndex];
      imgs[targetIndex] = temp;
      imgs.forEach((img, i) => (img.is_primary = i === 0));
      return { ...prev, images: imgs };
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const handleAddContent = () => {
    if (!newContentItem.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      contents: [...prev.contents, { ...newContentItem }],
    }));
    setNewContentItem({ name: '', quantity: '1', unit: 'pcs', specification: '' });
  };

  const handleRemoveContent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contents: prev.contents.filter((_, i) => i !== index),
    }));
  };

  const handleMoveContent = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const items = [...prev.contents];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      const temp = items[index];
      items[index] = items[target];
      items[target] = temp;
      return { ...prev, contents: items };
    });
  };

  const handleToggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.category_ids.includes(catId);
      const updated = exists
        ? prev.category_ids.filter((c) => c !== catId)
        : [...prev.category_ids, catId];
      return { ...prev, category_ids: updated };
    });
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p as any).sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category_id === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      p.status === filterStatus ||
      (filterStatus === 'published' && (p.status as any) === 'active');
    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, edit, price, and publish DIY celebration boxes directly to the live e-commerce website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <input
          type="text"
          placeholder="Search by product name, SKU or tagline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-pink"
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
            <option value="published">Published (Live)</option>
            <option value="draft">Draft (Hidden)</option>
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
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Live Store Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 space-y-2">
                    <Package className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold">No products found.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isPublished =
                    p.status === 'published' || (p.status as any) === 'active';
                  const mainImg = p.images?.[0]?.url || '/products/pastel-rose-setup.jpg';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={mainImg}
                            alt={p.name}
                            className="w-11 h-11 object-contain rounded-lg bg-slate-50 border border-slate-200 shrink-0 p-0.5"
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
                            <span className="text-[10px] text-slate-400 font-mono">
                              Slug: {p.slug || p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {categories.find((c) => c.id === p.category_id)?.name || 'Birthday'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-black text-brand-pink text-sm">
                          {formatPrice(p.selling_price)}
                        </span>
                        {(p as any).compare_at_price && (
                          <span className="text-[11px] text-slate-400 line-through block">
                            {formatPrice((p as any).compare_at_price)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            (p.stock_quantity ?? 50) <= 0
                              ? 'text-rose-600'
                              : (p.stock_quantity ?? 50) <= 10
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {(p.stock_quantity ?? 50) <= 0 ? 'Out of Stock' : `${p.stock_quantity ?? 50} kits`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title={isPublished ? 'Click to Unpublish' : 'Click to Publish'}
                        >
                          {isPublished ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Live on Store</span>
                            </>
                          ) : (
                            <span>Draft (Hidden)</span>
                          )}
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-brand-ink font-display">
                  {editingProduct ? 'Edit Celebration Box' : 'Add Celebration Box to Store'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Publishing saves directly to Supabase and immediately displays on the live store.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{formError}</p>
                </div>
              )}

              {/* 1. BASIC INFORMATION */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Name <span className="text-brand-pink">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Pastel Rose Celebration Box"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="e.g. CB-PR-001"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Slug (URL Identifier)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="e.g. pastel-rose-celebration-box"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Description / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder='e.g. "Big Moments. One Little Box."'
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what the kit creates and where it can be styled."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* 2. PRICING & INVENTORY */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  2. Pricing &amp; Stock Availability
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Selling Price (₹) <span className="text-brand-pink">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={formData.selling_price}
                      onChange={(e) =>
                        setFormData({ ...formData, selling_price: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-brand-pink text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Compare-at Price (₹ Optional Strike-through)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.compare_at_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compare_at_price: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 399"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Available Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stock_quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, stock_quantity: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 3. CATEGORY & THEME ASSIGNMENT */}
              <div className="space-y-3.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  3. Occasion Categories &amp; Colour Theme
                </h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Select Relevant Celebration Occasions (Multiple allowed)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((c) => {
                      const isSelected = formData.category_ids.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => handleToggleCategory(c.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-pink-50/80 border-brand-pink text-brand-pink font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Colour Theme</label>
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
              </div>

              {/* 4. PRODUCT PHOTOGRAPHS & REORDERING */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      4. Product Gallery Images
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Image 1 is the primary decoration preview; Image 2 is the contents infographic.
                    </p>
                  </div>
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

                {/* Reorderable Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-2 flex flex-col justify-between group ${
                          img.is_primary ? 'border-brand-pink bg-pink-50/20 shadow-xs' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center border border-slate-100">
                          <img
                            src={img.url}
                            alt={img.alt || `Product image ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className={`inline-flex items-center gap-1 font-bold ${
                                img.is_primary ? 'text-brand-pink' : 'text-slate-400 hover:text-slate-700'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${img.is_primary ? 'fill-brand-pink' : ''}`} />
                              <span>{img.is_primary ? 'Primary' : 'Set Primary'}</span>
                            </button>

                            <div className="flex items-center gap-1 text-slate-500">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 hover:text-slate-900 disabled:opacity-20"
                                title="Move up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === formData.images.length - 1}
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 hover:text-slate-900 disabled:opacity-20"
                                title="Move down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 text-rose-500 hover:text-rose-700"
                                title="Delete photo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. WHAT'S INSIDE THE BOX */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    5. What's Inside the Box (Exact Kit Inclusions)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Total: {formData.contents.reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0)} pieces
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
                    placeholder="Qty (26)"
                    value={newContentItem.quantity}
                    onChange={(e) =>
                      setNewContentItem({ ...newContentItem, quantity: e.target.value })
                    }
                    className="w-16 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Unit (pcs)"
                    value={newContentItem.unit}
                    onChange={(e) => setNewContentItem({ ...newContentItem, unit: e.target.value })}
                    className="w-16 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Spec (12-inch Natural Latex)"
                    value={newContentItem.specification}
                    onChange={(e) =>
                      setNewContentItem({ ...newContentItem, specification: e.target.value })
                    }
                    className="w-36 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddContent}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
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
                        <span className="font-bold text-brand-pink">
                          ({item.quantity} {item.unit})
                        </span>
                        {item.specification && (
                          <span className="text-[11px] text-slate-400">— {item.specification}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveContent(idx, 'up')}
                          className="p-1 hover:text-slate-900 disabled:opacity-20 text-slate-400"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.contents.length - 1}
                          onClick={() => handleMoveContent(idx, 'down')}
                          className="p-1 hover:text-slate-900 disabled:opacity-20 text-slate-400"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveContent(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. EXCLUSIONS */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                  6. Honest Note &amp; Exclusions
                </h3>
                <input
                  type="text"
                  placeholder="e.g. Cake, backdrop curtain, metal arch stand, and balloon pump are not included."
                  value={formData.exclusions[0] || ''}
                  onChange={(e) => setFormData({ ...formData, exclusions: [e.target.value] })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <div className="w-full sm:w-auto flex flex-wrap items-center gap-2.5 justify-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveProduct('draft')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveProduct('published')}
                  className="px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing to Database...' : 'Publish to Live Store'}
                </button>
              </div>
            </div>
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

            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink bg-pink-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-pink-100">
              Customer View Preview
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
