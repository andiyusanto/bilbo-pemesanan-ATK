import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  PackageSearch, 
  BarChart3, 
  HelpCircle,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { BranchQuota } from '../types';

interface SidebarProps {
  currentTab: 'dashboard' | 'new-order' | 'history' | 'catalog' | 'reports';
  onSelectTab: (tab: 'dashboard' | 'new-order' | 'history' | 'catalog' | 'reports') => void;
  quota: BranchQuota;
  pendingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  quota,
  pendingCount,
}) => {
  const percentUsed = Math.round((quota.usedBudget / quota.monthlyBudget) * 100);
  const remainingBudget = quota.monthlyBudget - quota.usedBudget;

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'new-order' as const,
      label: 'Buat Pesanan',
      icon: PlusCircle,
      badge: 'Baru',
      highlight: true,
    },
    {
      id: 'history' as const,
      label: 'Riwayat Pesanan',
      icon: History,
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    {
      id: 'catalog' as const,
      label: 'Katalog ATK',
      icon: PackageSearch,
      badge: '12 SKU',
    },
    {
      id: 'reports' as const,
      label: 'Laporan & Budget',
      icon: BarChart3,
      badge: 'Admin',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <aside id="main-sidebar" className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Primary Navigation Links */}
      <div className="p-4 space-y-1 flex-1">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                isActive
                  ? 'bg-red-50 text-[#E60000] border border-red-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition ${
                  isActive ? 'text-[#E60000]' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.badgeColor 
                    ? item.badgeColor 
                    : item.highlight 
                      ? 'bg-red-100 text-[#E60000]' 
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Sidebar Info Card: Kuota / Budget ATK Summary */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Kuota ATK Cabang</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div id="sidebar-quota-box" className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Periode {quota.period}</span>
              <span className="text-[11px] font-bold text-slate-900">{percentUsed}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2.5">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  percentUsed > 80 ? 'bg-amber-500' : 'bg-[#E60000]'
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Terpakai:</span>
                <span className="font-medium text-slate-800">{formatRupiah(quota.usedBudget)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sisa Kuota:</span>
                <span className="font-bold text-emerald-600">{formatRupiah(remainingBudget)}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('reports')}
              className="mt-3 w-full text-center text-[11px] text-[#E60000] hover:text-red-700 font-semibold py-1 hover:bg-red-50/50 rounded transition"
            >
              Lihat Detail Anggaran →
            </button>
          </div>
        </div>

        {/* SLA & SOP Info */}
        <div className="pt-4">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
              <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
              <span>SOP Pengadaan Vendor</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Pesanan sebelum pk 14:00 WIB diproses vendor pada H+1 hari kerja.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center space-x-1.5 font-medium text-slate-700">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Helpdesk Logistik Telkomsel</span>
        </div>
        <p className="text-slate-400">Ext: 8820 • logistik@telkomsel.co.id</p>
        <div className="pt-1 text-[10px] text-slate-400">
          e-Procurement Portal v2.4 Enterprise
        </div>
      </div>

    </aside>
  );
};
