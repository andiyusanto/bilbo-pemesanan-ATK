import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  Wallet, 
  Truck, 
  ArrowUpRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { BranchQuota, Order } from '../types';

interface StatCardsProps {
  orders: Order[];
  quota: BranchQuota;
  onFilterStatus?: (status: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  orders,
  quota,
  onFilterStatus,
}) => {
  const totalOrdersThisMonth = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped' || o.status === 'approved').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  
  const remainingBudget = quota.monthlyBudget - quota.usedBudget;
  const usedPercentage = Math.round((quota.usedBudget / quota.monthlyBudget) * 100);

  return (
    <div id="stat-cards-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
      
      {/* 1. Total Pesanan Bulan Ini */}
      <div 
        id="card-total-pesanan"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pesanan Bulan Ini
          </span>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-[#E60000] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalOrdersThisMonth}
            <span className="text-xs font-medium text-slate-500 ml-1.5 font-normal">PO Diajukan</span>
          </div>
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2 PO
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Nilai Pesanan:</span>
          <span className="font-bold text-slate-800">{formatRupiah(quota.usedBudget)}</span>
        </div>
      </div>

      {/* 2. Pesanan Pending Approval */}
      <div 
        id="card-pending-approval"
        onClick={() => onFilterStatus && onFilterStatus('pending')}
        className={`bg-white rounded-xl p-5 border transition cursor-pointer ${
          pendingOrders > 0 
            ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400' 
            : 'border-slate-200 hover:border-slate-300'
        } shadow-xs`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Menunggu Approval
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pendingOrders}
            <span className="text-xs font-medium text-slate-500 ml-1.5 font-normal">Pesanan</span>
          </div>
          {pendingOrders > 0 ? (
            <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3 mr-1" /> Perlu Review Spv
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Semua Clear
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Status Workflow:</span>
          <span className="font-semibold text-amber-700">Verifikasi Supervisor</span>
        </div>
      </div>

      {/* 3. Sisa Budget / Kuota ATK Bulan Ini */}
      <div 
        id="card-sisa-budget"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sisa Kuota Budget ATK
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight">
            {formatRupiah(remainingBudget)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            dari plafon {formatRupiah(quota.monthlyBudget)}/bln
          </div>
        </div>

        {/* Progress Bar with label */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-500">Utilisasi Anggaran:</span>
            <span className="font-bold text-slate-800">{usedPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usedPercentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(usedPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Pengiriman & Selesai */}
      <div 
        id="card-pengiriman-status"
        className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pengiriman Vendor
          </span>
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {shippedOrders}
            <span className="text-xs font-medium text-slate-500 ml-1.5 font-normal">Dalam Proses</span>
          </div>
          <span className="inline-flex items-center text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
            {completedOrders} Selesai Diterima
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Vendor Rekanan:</span>
          <span className="font-semibold text-slate-800">PT Mitra Graha Niaga</span>
        </div>
      </div>

    </div>
  );
};
