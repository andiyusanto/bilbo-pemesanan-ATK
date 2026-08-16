import React from 'react';
import { 
  BarChart3, 
  Download, 
  Building, 
  TrendingUp, 
  PieChart, 
  CheckCircle2, 
  Calendar
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { BranchQuota } from '../types';

interface ReportsViewProps {
  quota: BranchQuota;
  allBranches: Array<{ id: string; name: string; city: string; code: string; quota: number; used: number }>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  quota,
  allBranches,
}) => {
  const totalNationalBudget = allBranches.reduce((acc, b) => acc + b.quota, 0);
  const totalNationalUsed = allBranches.reduce((acc, b) => acc + b.used, 0);
  const totalNationalRemaining = totalNationalBudget - totalNationalUsed;

  const categoryBreakdown = [
    { name: 'Kertas & Formulir Pelayanan', amount: 3250000, percent: 41, color: 'bg-[#E60000]' },
    { name: 'Tinta & Toner Printer Counter', amount: 2100000, percent: 27, color: 'bg-slate-800' },
    { name: 'Perlengkapan CS & Lanyard', amount: 1450000, percent: 18, color: 'bg-blue-600' },
    { name: 'Alat Tulis & Map Pengarsipan', amount: 1050000, percent: 14, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Laporan & Monitoring Anggaran ATK GraPARI
            </h2>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Periode: {quota.period}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekap utilisasi kuota anggaran dan riwayat serapan biaya pengadaan ATK di seluruh jaringan cabang GraPARI.
          </p>
        </div>

        <button
          onClick={() => alert('Mendownload Laporan Rekapitulasi Anggaran ATK GraPARI (Format Excel/PDF).')}
          className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Laporan Konsolidasi</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Plafon Anggaran Nasional
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {formatRupiah(totalNationalBudget)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Total {allBranches.length} Cabang Utama</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Realisasi Pengadaan
          </div>
          <div className="text-2xl font-extrabold text-[#E60000] mt-2">
            {formatRupiah(totalNationalUsed)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Math.round((totalNationalUsed / totalNationalBudget) * 100)}% dari total plafon terserap
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Sisa Kuota Tersedia
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {formatRupiah(totalNationalRemaining)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Status anggaran: Terkendali (Aman)</div>
        </div>
      </div>

      {/* Grid: Breakdown Kategori & Tabel Cabang */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#E60000]" />
            Distribusi Belanja Berdasarkan Kategori ATK
          </h3>

          <div className="space-y-3">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat.name}</span>
                  <span className="font-bold text-slate-900">{formatRupiah(cat.amount)} ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Catatan Efisiensi Logistik:
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Penggunaan formulir fisik turun 15% berkat digitalisasi MyGraPARI kiosk, sementara kertas thermal antrian dan pita ribbon printer stabil sesuai target kuota.
            </p>
          </div>
        </div>

        {/* Branch Utilization Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Monitoring Kuota per Cabang GraPARI
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-2.5 px-3">Nama Cabang GraPARI</th>
                  <th className="py-2.5 px-3 text-right">Plafon Kuota</th>
                  <th className="py-2.5 px-3 text-right">Terpakai</th>
                  <th className="py-2.5 px-3 text-center">Serapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allBranches.map((b) => {
                  const pct = Math.round((b.used / b.quota) * 100);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{b.name}</div>
                        <div className="text-[10px] text-slate-500">{b.city} • {b.code}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{formatRupiah(b.quota)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{formatRupiah(b.used)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pct > 75 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
