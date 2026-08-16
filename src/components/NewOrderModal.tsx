import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Info
} from 'lucide-react';
import { CatalogItem, Order, OrderItem, BranchQuota, UserProfile } from '../types';
import { formatRupiah } from '../utils/formatters';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: CatalogItem[];
  user: UserProfile;
  quota: BranchQuota;
  onCreateOrder: (newOrder: Order) => void;
}

interface CartEntry {
  item: CatalogItem;
  qty: number;
  notes: string;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  catalog,
  user,
  quota,
  onCreateOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [cart, setCart] = useState<Record<string, CartEntry>>({
    'CAT-002': { item: catalog.find(c => c.id === 'CAT-002') || catalog[0], qty: 20, notes: 'Watermark logo Telkomsel' },
    'CAT-001': { item: catalog.find(c => c.id === 'CAT-001') || catalog[1], qty: 5, notes: '' },
  });
  const [justificationNotes, setJustificationNotes] = useState('Kebutuhan operasional loket layanan pelanggan & back office GraPARI.');
  const [department, setDepartment] = useState('Customer Touchpoint Operation');

  if (!isOpen) return null;

  const categories = ['Semua', ...Array.from(new Set(catalog.map(c => c.category)))];

  const filteredCatalog = catalog.filter(item => {
    if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q);
    }
    return true;
  });

  const cartItemsList: CartEntry[] = Object.values(cart);
  const totalOrderAmount = cartItemsList.reduce((sum: number, entry: CartEntry) => sum + (entry.item.unitPrice * entry.qty), 0);
  const remainingBudget = quota.monthlyBudget - quota.usedBudget;
  const isOverBudget = totalOrderAmount > remainingBudget;

  const handleAddToCart = (item: CatalogItem) => {
    setCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: { ...existing, qty: existing.qty + 1 }
        };
      } else {
        return {
          ...prev,
          [item.id]: { item, qty: item.minOrderQty || 1, notes: '' }
        };
      }
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: { ...existing, qty: newQty }
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsList.length === 0) {
      alert('Pilih minimal 1 item ATK untuk dipesan.');
      return;
    }
    if (isOverBudget) {
      const confirmExceed = confirm('Total pesanan melebihi sisa kuota budget bulanan GraPARI. Pengajuan ini akan memerlukan approval khusus dari GM Regional. Tetap lanjutkan?');
      if (!confirmExceed) return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} Agu 2026, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const orderNumber = `PO/ATK-TSL/2026/08/${randomSeq}`;

    const items: OrderItem[] = cartItemsList.map(entry => ({
      id: entry.item.id,
      code: entry.item.code,
      name: entry.item.name,
      category: entry.item.category,
      unit: entry.item.unit,
      pricePerUnit: entry.item.unitPrice,
      quantity: entry.qty,
      notes: entry.notes || undefined,
    }));

    const newOrder: Order = {
      id: `ORD-2026-0816-${randomSeq}`,
      orderNumber,
      date: formattedDate,
      branchId: user.branchId,
      branchName: user.branchName,
      branchCity: 'Jakarta Barat',
      requesterName: user.name,
      requesterRole: user.role,
      department,
      status: 'pending',
      items,
      totalAmount: totalOrderAmount,
      vendorName: 'PT Mitra Graha Niaga ATK (Vendor Resmi Telkomsel)',
      notes: justificationNotes,
      approvalHistory: [
        {
          step: 'Pengajuan Pesanan',
          approver: user.name,
          role: user.role,
          status: 'approved',
          timestamp: formattedDate,
          comment: 'Pesanan diajukan via Portal ATK GraPARI.',
        },
        {
          step: 'Verifikasi Supervisor GraPARI',
          approver: 'Budi Santoso',
          role: 'Spv Customer Touchpoint',
          status: 'pending',
          comment: 'Menunggu review alokasi kuota cabang.',
        },
      ],
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div id="new-order-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        id="new-order-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#E60000] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Buat Pengajuan Pesanan ATK Baru
              </h3>
              <p className="text-xs text-red-100 font-medium">
                Pemesanan resmi internal ke vendor rekanan PT Mitra Graha Niaga
              </p>
            </div>
          </div>

          <button
            id="btn-close-new-order"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns on larger screens */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left Column: ATK Catalog Picker (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 space-y-4">
            
            {/* Branch & Requester Badge */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E60000]" />
                <div>
                  <span className="font-bold text-slate-800">{user.branchName}</span>
                  <span className="text-slate-500 text-[11px] block">Pemohon: {user.name}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Sisa Kuota Budget:</span>
                <span className="font-bold text-emerald-600">{formatRupiah(remainingBudget)}</span>
              </div>
            </div>

            {/* Catalog Search & Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari ATK (misal: kertas thermal antrian, toner, formulir, stopmap)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#E60000]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredCatalog.map((item) => {
                const isSelected = !!cart[item.id];
                const cartQty = cart[item.id]?.qty || 0;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'border-red-300 bg-red-50/30' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{item.code}</span>
                        {item.isSpecialGraPARIItem && (
                          <span className="text-[10px] bg-red-100 text-[#E60000] font-bold px-1.5 py-0.2 rounded">
                            Khusus GraPARI
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium">{item.category}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.name}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                      <div className="text-xs font-bold text-[#E60000] mt-1">
                        {formatRupiah(item.unitPrice)} <span className="font-normal text-slate-500 text-[10px]">/{item.unit}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="flex items-center space-x-1.5 bg-white border border-red-200 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-slate-900">{cartQty}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#E60000] hover:bg-red-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#E60000] hover:text-white text-slate-800 rounded-lg text-xs font-semibold transition"
                        >
                          + Tambah
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Order Cart & Justification (5 cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50/50 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#E60000]" />
                  Item Terpilih ({cartItemsList.length})
                </h4>
                {cartItemsList.length > 0 && (
                  <button
                    onClick={() => setCart({})}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold"
                  >
                    Kosongkan
                  </button>
                )}
              </div>

              {/* Cart List */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {cartItemsList.length > 0 ? (
                  cartItemsList.map(({ item, qty }) => (
                    <div key={item.id} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {qty} {item.unit} × {formatRupiah(item.unitPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatRupiah(item.unitPrice * qty)}</div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Belum ada barang ATK yang dipilih. Klik <strong>+ Tambah</strong> dari katalog di sebelah kiri.
                  </div>
                )}
              </div>

              {/* Form Justification & Department */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Unit / Divisi Pemohon
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Customer Touchpoint Operation">Customer Touchpoint Operation (Loket CS)</option>
                    <option value="Billing & Pascabayar Halo">Billing & Pascabayar Halo</option>
                    <option value="Cashier & Teller GraPARI">Cashier & Teller GraPARI</option>
                    <option value="Back Office & Logistik Cabang">Back Office & Logistik Cabang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Catatan / Keperluan Pengadaan ATK
                  </label>
                  <textarea
                    rows={2}
                    value={justificationNotes}
                    onChange={(e) => setJustificationNotes(e.target.value)}
                    placeholder="Contoh: Kebutuhan operasional antrian loket baru..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Summary & Submit */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Estimasi Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(totalOrderAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sisa Kuota GraPARI:</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(remainingBudget)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200">
                  <span className="text-slate-900">Total Nilai Pesanan:</span>
                  <span className="text-[#E60000] text-sm">{formatRupiah(totalOrderAmount)}</span>
                </div>
              </div>

              {isOverBudget && (
                <div className="flex items-start gap-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Total melebihi sisa plafon budget cabang bulan ini. Memerlukan persetujuan khusus Manager Regional.</span>
                </div>
              )}

              <button
                id="btn-submit-order"
                onClick={handleSubmit}
                disabled={cartItemsList.length === 0}
                className="w-full py-2.5 bg-[#E60000] hover:bg-[#CC0000] active:bg-[#B30000] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-xs transition duration-150 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim Pengajuan Pesanan ke Spv</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
