import React, { useState } from 'react';
import { 
  PackageSearch, 
  Search, 
  Plus, 
  Check, 
  Layers, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';
import { CatalogItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CatalogViewProps {
  catalog: CatalogItem[];
  onOpenNewOrder: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  catalog,
  onOpenNewOrder,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(catalog.map(c => c.category)))];

  const filteredItems = catalog.filter(item => {
    if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Katalog Resmi ATK & Formulir GraPARI
            </h2>
            <span className="bg-red-100 text-[#E60000] text-xs font-bold px-2.5 py-0.5 rounded-full">
              Vendor Telkomsel Terverifikasi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Daftar standar perlengkapan kantor, formulir pelayanan pelanggan, thermal roll Qmatic, dan consumables printer yang telah distandardisasi secara nasional.
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="inline-flex items-center justify-center space-x-2 bg-[#E60000] hover:bg-[#CC0000] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Pesanan dari Katalog</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama SKU, kode ATK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#E60000]"
          />
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.code}
                </span>
                {item.isSpecialGraPARIItem ? (
                  <span className="text-[10px] font-bold bg-red-50 text-[#E60000] border border-red-200 px-2 py-0.5 rounded-full">
                    Standar GraPARI
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                    Umum
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-1">
                {item.name}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Harga Satuan Kontrak:</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatRupiah(item.unitPrice)}
                  <span className="text-xs text-slate-500 font-normal"> /{item.unit}</span>
                </span>
              </div>

              <button
                onClick={onOpenNewOrder}
                className="bg-red-50 hover:bg-[#E60000] text-[#E60000] hover:text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-red-100 transition"
              >
                Pesan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
