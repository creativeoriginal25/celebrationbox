import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  TrendingDown,
  TrendingUp,
  X,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { InventoryItem, InventoryMovement } from '../../types';
import { formatPrice } from '../../utils/currency';
import {
  addInventoryItem,
  recordInventoryMovement,
  updateInventoryItem,
} from '../../services/adminService';

interface AdminInventoryProps {
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  onRefresh: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({
  inventory,
  movements,
  onRefresh,
}) => {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedItemForMovement, setSelectedItemForMovement] = useState<InventoryItem | null>(null);

  // New Item State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Balloons',
    quantity_available: 50,
    unit_cost: 15.0,
    supplier: '',
    reorder_level: 15,
  });

  // Movement State
  const [movementData, setMovementData] = useState<{
    change_quantity: number;
    reason: 'restock' | 'usage' | 'damage' | 'adjustment';
    notes: string;
  }>({
    change_quantity: 10,
    reason: 'restock',
    notes: '',
  });

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    try {
      await addInventoryItem({
        name: newItem.name.trim(),
        category: newItem.category,
        quantity_available: Number(newItem.quantity_available),
        unit_cost: Number(newItem.unit_cost),
        supplier: newItem.supplier.trim() || 'General Supplier',
        reorder_level: Number(newItem.reorder_level),
      });
      setIsAddItemOpen(false);
      onRefresh();
    } catch (err) {
      alert('Failed to add material');
    }
  };

  const handleOpenMovement = (item: InventoryItem, reason: 'restock' | 'usage') => {
    setSelectedItemForMovement(item);
    setMovementData({
      change_quantity: reason === 'restock' ? 25 : 1,
      reason,
      notes: reason === 'restock' ? 'Supplier shipment restock' : 'Assembly for kits',
    });
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForMovement) return;

    const qty =
      movementData.reason === 'restock' || movementData.reason === 'adjustment'
        ? Math.abs(movementData.change_quantity)
        : -Math.abs(movementData.change_quantity);

    try {
      await recordInventoryMovement({
        item_id: selectedItemForMovement.id,
        item_name: selectedItemForMovement.name,
        change_quantity: qty,
        reason: movementData.reason,
        notes: movementData.notes,
      });

      setIsMovementModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Failed to record movement');
    }
  };

  const lowStockCount = inventory.filter((i) => i.quantity_available <= i.reorder_level).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Material Inventory &amp; Stock
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track latex balloons, banners, arch strips, glue dots, and shipping boxes.
          </p>
        </div>

        <button
          onClick={() => setIsAddItemOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      {/* Stock Health Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-sm block">
                {lowStockCount} Material{lowStockCount > 1 ? 's' : ''} at or Below Reorder Level
              </span>
              <span className="text-amber-800 text-[11px]">
                Order supplier restocks soon to prevent fulfillment delays.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-brand-ink">Decoration Materials Stock</h2>
          <span className="text-xs text-slate-400 font-medium">
            {inventory.length} materials tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Available Qty</th>
                <th className="py-3 px-4">Reorder Level</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Quick Stock Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => {
                const isLow = item.quantity_available <= item.reorder_level;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <span className="text-[10px] text-slate-400">
                        Updated {new Date(item.last_updated).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.category}</td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm ${
                            isLow ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {item.quantity_available}
                        </span>
                        {isLow && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Low
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {item.reorder_level}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {formatPrice(item.unit_cost)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {item.supplier || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenMovement(item, 'restock')}
                          className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-brand-teal font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          title="Record Restock"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                        <button
                          onClick={() => handleOpenMovement(item, 'usage')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          title="Record Usage / Damage"
                        >
                          <Minus className="w-3 h-3" />
                          <span>Use</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement History Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-extrabold text-brand-ink">
              Recent Inventory Movement Audit
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {movements.length} logged entries
          </span>
        </div>

        {movements.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">
            No stock movements recorded yet. Movements are logged whenever stock is added or used.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {movements.slice(0, 8).map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      m.change_quantity > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {m.change_quantity > 0 ? '+' : '-'}
                  </span>
                  <div>
                    <span className="font-bold text-slate-800">
                      {m.item_name || 'Material Item'}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {m.notes || m.reason} • {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="font-mono font-bold text-sm">
                  <span
                    className={
                      m.change_quantity > 0 ? 'text-emerald-700 font-black' : 'text-rose-600'
                    }
                  >
                    {m.change_quantity > 0 ? `+${m.change_quantity}` : m.change_quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* RECORD MOVEMENT MODAL                                          */}
      {/* ============================================================== */}
      {isMovementModalOpen && selectedItemForMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-brand-ink">
                Record Stock: {selectedItemForMovement.name}
              </h2>
              <button
                onClick={() => setIsMovementModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMovementSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Movement Reason
                </label>
                <select
                  value={movementData.reason}
                  onChange={(e) =>
                    setMovementData({
                      ...movementData,
                      reason: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="restock">Restock (+ Add Stock)</option>
                  <option value="usage">Kit Assembly / Usage (- Deduct Stock)</option>
                  <option value="damage">Damaged / Expired (- Deduct Stock)</option>
                  <option value="adjustment">Manual Count Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity ({movementData.reason === 'restock' ? 'Units to add' : 'Units to deduct'})
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={movementData.change_quantity}
                  onChange={(e) =>
                    setMovementData({
                      ...movementData,
                      change_quantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notes / Supplier Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Received new shipment from supplier"
                  value={movementData.notes}
                  onChange={(e) =>
                    setMovementData({ ...movementData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMovementModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink-hover shadow-xs"
                >
                  Record Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD MATERIAL MODAL                                             */}
      {/* ============================================================== */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-extrabold text-brand-ink">Add Decoration Material</h2>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Material Name <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metallic Silver Foil Curtains"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Balloons">Balloons</option>
                    <option value="Banners">Banners</option>
                    <option value="Tools & Adhesive">Tools & Adhesive</option>
                    <option value="Backdrops">Backdrops</option>
                    <option value="Candles & Accessories">Candles & Accessories</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starting Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.quantity_available}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity_available: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={newItem.unit_cost}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit_cost: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min={1}
                    value={newItem.reorder_level}
                    onChange={(e) =>
                      setNewItem({ ...newItem, reorder_level: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  placeholder="e.g. Gemini Latex Supplies"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink-hover shadow-xs"
                >
                  Add Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
