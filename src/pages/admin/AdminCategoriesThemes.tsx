import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Check,
  X,
  Edit2,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { OccasionCategory, ThemeOption } from '../../types';
import { updateCategory, updateTheme } from '../../services/adminService';

interface AdminCategoriesThemesProps {
  categories: OccasionCategory[];
  themes: ThemeOption[];
  onRefresh: () => void;
}

export const AdminCategoriesThemes: React.FC<AdminCategoriesThemesProps> = ({
  categories,
  themes,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'themes'>('categories');
  const [editingCategory, setEditingCategory] = useState<OccasionCategory | null>(null);
  const [editingTheme, setEditingTheme] = useState<ThemeOption | null>(null);

  const handleToggleCategoryAvailability = async (cat: OccasionCategory) => {
    try {
      await updateCategory(cat.id, { isAvailable: !cat.isAvailable });
      onRefresh();
    } catch (err) {
      alert('Failed to update category availability');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        tagline: editingCategory.tagline,
        description: editingCategory.description,
        badge: editingCategory.badge,
        isAvailable: editingCategory.isAvailable,
      });
      setEditingCategory(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save category');
    }
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;
    try {
      await updateTheme(editingTheme.id, {
        name: editingTheme.name,
        isAvailable: editingTheme.isAvailable,
        description: editingTheme.description,
      });
      setEditingTheme(null);
      onRefresh();
    } catch (err) {
      alert('Failed to save theme');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Categories & Colour Themes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure celebration collections and balloon color palettes.
          </p>
        </div>

        <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-white text-brand-ink shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Occasion Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'themes'
                ? 'bg-white text-brand-ink shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Colour Themes ({themes.length})
          </button>
        </div>
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Brand Architecture Note:</strong> Circular occasion icons remain on the public homepage to invite exploration. Marking an occasion as "Available" displays its celebration kits; unavailable occasions show friendly "Coming Soon" notification options.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Occasion</th>
                  <th className="py-3 px-4">Tagline</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4">Catalogue State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-slate-200"
                          style={{ backgroundColor: cat.bgColor || '#FFF8F0' }}
                        >
                          {cat.name.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{cat.name}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /category/{cat.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {cat.tagline || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      {cat.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {cat.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleCategoryAvailability(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          cat.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle active catalogue visibility"
                      >
                        {cat.isAvailable ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Active In Store</span>
                          </>
                        ) : (
                          <span>Coming Soon</span>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        className="p-1.5 text-slate-400 hover:text-brand-pink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit category details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* THEMES TAB */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Theme Name</th>
                  <th className="py-3 px-4">Palette Swatches</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {themes.map((theme) => (
                  <tr key={theme.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {theme.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {theme.colors?.map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate">
                      {theme.description || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          theme.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {theme.isAvailable ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setEditingTheme({ ...theme })}
                        className="p-1.5 text-slate-400 hover:text-brand-pink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit theme"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-brand-ink font-display">
                Edit Occasion: {editingCategory.name}
              </h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Occasion Title</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingCategory.tagline}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={editingCategory.badge || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, badge: e.target.value })
                  }
                  placeholder="e.g. Popular, Coming Soon"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store Status</label>
                <select
                  value={editingCategory.isAvailable ? 'true' : 'false'}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      isAvailable: e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="true">Active (Show celebration products)</option>
                  <option value="false">Coming Soon (Collect customer notify interest)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink-hover shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT THEME MODAL */}
      {editingTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-brand-ink font-display">
                Edit Theme: {editingTheme.name}
              </h2>
              <button
                onClick={() => setEditingTheme(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTheme} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme Name</label>
                <input
                  type="text"
                  required
                  value={editingTheme.name}
                  onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingTheme.description || ''}
                  onChange={(e) =>
                    setEditingTheme({ ...editingTheme, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                <select
                  value={editingTheme.isAvailable ? 'true' : 'false'}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      isAvailable: e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="true">Active Theme</option>
                  <option value="false">Inactive / Archived</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingTheme(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink-hover shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
