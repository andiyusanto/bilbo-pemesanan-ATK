import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Calendar, 
  User, 
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import { formatRupiah, getStatusBadge } from '../utils/formatters';
import { Order, OrderStatus } from '../types';

interface RecentOrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  onSelectOrder,
  onOpenNewOrder,
  activeFilter,
  setActiveFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter tabs definition
  const filterTabs = [
    { id: 'all', label: 'Semua Status', count: orders.length },
    { id: 'pending', label: 'Menunggu Approval', count: orders.filter(o => o.status === 'pending').length },
    { id: 'approved', label: 'Disetujui', count: orders.filter(o => o.status === 'approved').length },
    { id: 'shipped', label: 'Dalam Pengiriman', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'completed', label: 'Selesai', count: orders.filter(o => o.status === 'completed').length },
    { id: 'rejected', label: 'Ditolak', count: orders.filter(o => o.status === 'rejected').length },
  ];

  // Filtering & Search
  const filteredOrders = orders.filter((order) => {
    // Filter by status tab
    if (activeFilter !== 'all' && order.status !== activeFilter) {
      return false;
    }
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.orderNumber.toLowerCase().includes(q);
      const matchRequester = order.requesterName.toLowerCase().includes(q);
      const matchItems = order.items.some(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q));
      return matchNumber || matchRequester || matchItems;
    }
    return true;
  });

  return (
    <div id="recent-orders-section" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table Section Header & Top Actions */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Section Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Daftar Pesanan ATK Terbaru
              </h2>
              <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {filteredOrders.length} Pesanan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan pantau status persetujuan pengadaan ATK GraPARI ke vendor rekanan
            </p>
          </div>

          {/* Primary Action Button: + Buat Pesanan Baru (Telkomsel Red) */}
          <div className="flex items-center gap-3">
            <button
              id="btn-export-orders"
              onClick={() => alert('Mengekspor rekap pengadaan ATK GraPARI dalam format Excel/CSV.')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export Rekap</span>
            </button>

            <button
              id="btn-buat-pesanan-baru"
              onClick={onOpenNewOrder}
              className="inline-flex items-center justify-center space-x-2 bg-[#E60000] hover:bg-[#CC0000] active:bg-[#B30000] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Buat Pesanan Baru</span>
            </button>
          </div>

        </div>

        {/* Filter Tabs & Search Bar Row */}
        <div className="mt-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-filter-${tab.id}`}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Field */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="input-search-orders"
              type="text"
              placeholder="Cari No. PO, Pemohon, Item ATK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#E60000] transition"
            />
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">No. Purchase Order</th>
              <th className="py-3.5 px-4 font-semibold">Tanggal & Waktu</th>
              <th className="py-3.5 px-4 font-semibold">Pemohon & Unit</th>
              <th className="py-3.5 px-4 font-semibold">Ringkasan Item ATK</th>
              <th className="py-3.5 px-4 font-semibold text-right">Total Nilai</th>
              <th className="py-3.5 px-4 font-semibold text-center">Status Pesanan</th>
              <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                const totalItemQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <tr 
                    key={order.id} 
                    id={`order-row-${order.id}`}
                    className="hover:bg-slate-50/80 transition duration-150 group"
                  >
                    {/* No. PO */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-[#E60000] transition flex items-center gap-1.5">
                        {order.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {order.id}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span className="font-medium">{order.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.branchCity}
                      </div>
                    </td>

                    {/* Pemohon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center text-slate-900 font-semibold">
                        <User className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                        <span>{order.requesterName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                        {order.department}
                      </div>
                    </td>

                    {/* Ringkasan Item */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {order.items[0]?.name}
                        {order.items.length > 1 && (
                          <span className="text-slate-500 font-normal"> +{order.items.length - 1} item lainnya</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Total {totalItemQty} unit barang • {order.items.length} varian SKU
                      </div>
                    </td>

                    {/* Total Biaya */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-extrabold text-slate-900">
                        {formatRupiah(order.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Include PPN 11%
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} mr-1.5`} />
                        {badge.label}
                      </span>
                    </td>

                    {/* Aksi Button */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        id={`btn-detail-${order.id}`}
                        onClick={() => onSelectOrder(order)}
                        className="inline-flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition"
                        title="Lihat Detail Pesanan & Lembar PO"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Detail PO</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">Tidak ada pesanan ditemukan</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coba ubah kata kunci pencarian atau ganti filter status di atas.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary & Information */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          Menampilkan <span className="font-semibold text-slate-800">{filteredOrders.length}</span> dari{' '}
          <span className="font-semibold text-slate-800">{orders.length}</span> total riwayat pesanan
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Vendor Resmi: PT Mitra Graha Niaga ATK (SLA Pengiriman 1-2 Hari Kerja)</span>
        </div>
      </div>

    </div>
  );
};
