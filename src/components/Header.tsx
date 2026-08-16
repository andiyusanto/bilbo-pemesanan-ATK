import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  activeBranchName: string;
  allBranches: Array<{ id: string; name: string; city: string; code: string }>;
  onSelectBranch: (branchId: string) => void;
  onOpenNewOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeBranchName,
  allBranches,
  onSelectBranch,
}) => {
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'PO/ATK-TSL/2026/08/0128 Disetujui',
      desc: 'Pesanan telah disetujui Manager Logistik & diteruskan ke vendor.',
      time: '15 Agu 2026, 10:10 WIB',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: '2',
      title: 'PO/ATK-TSL/2026/08/0096 Dalam Pengiriman',
      desc: 'Vendor telah mengirim paket ATK melalui JNE Express (Resi: JNE-TRK-99201827419).',
      time: '12 Agu 2026, 14:00 WIB',
      icon: Truck,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      id: '3',
      title: 'Verifikasi Menunggu Approval',
      desc: '1 pesanan baru diajukan dan menunggu verifikasi Spv.',
      time: 'Hari ini, 09:30 WIB',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & App Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Telkomsel Official Red Brand Box */}
            <div className="flex items-center gap-3">
              <div 
                id="telkomsel-logo-container" 
                className="w-10 h-10 rounded-lg bg-[#E60000] flex items-center justify-center text-white shadow-xs font-black tracking-tighter text-lg select-none"
              >
                T
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    Telkomsel
                  </span>
                  <span className="bg-red-50 text-[#E60000] text-[11px] font-bold px-2 py-0.5 rounded-full border border-red-200 tracking-wide uppercase">
                    GraPARI Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Sistem Pemesanan ATK & Pengadaan Internal
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            {/* Branch Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                id="btn-branch-selector"
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="flex items-center space-x-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs transition duration-150"
              >
                <Building2 className="w-3.5 h-3.5 text-[#E60000]" />
                <span className="font-semibold text-slate-800 max-w-[220px] truncate">
                  {activeBranchName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showBranchDropdown && (
                <div 
                  id="branch-dropdown-menu"
                  className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Pilih Lokasi GraPARI
                  </div>
                  {allBranches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        onSelectBranch(branch.id);
                        setShowBranchDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 hover:text-[#E60000] flex items-center justify-between transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{branch.name}</div>
                        <div className="text-[11px] text-slate-500">{branch.city} • Code: {branch.code}</div>
                      </div>
                      {branch.name === activeBranchName && (
                        <span className="w-2 h-2 rounded-full bg-[#E60000]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area: Vendor Link, Notifications, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Vendor Partner Status Indicator */}
            <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Vendor Terhubung:</span>
              <span className="font-semibold text-slate-800">PT Mitra Graha Niaga</span>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E60000] rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div 
                  id="notifications-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Notifikasi Pesanan</span>
                    <span className="text-[11px] text-[#E60000] font-semibold cursor-pointer hover:underline">
                      Tandai Sudah Dibaca
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const IconComponent = n.icon;
                      return (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer flex gap-3">
                          <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Card */}
            <div className="relative">
              <button
                id="btn-user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-slate-100 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                    {user.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div 
                  id="user-menu-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      ID: {user.id} • {user.branchRegion}
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => alert(`Informasi Akun Internal:\nNama: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nCabang: ${activeBranchName}`)}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <span>Profil & Pengaturan Akun</span>
                    </button>
                    <button 
                      onClick={() => alert('Sistem Pemesanan ATK GraPARI Telkomsel\nVersi 2.4.0 (Enterprise Internal)')}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <span>Bantuan & SOP Pengadaan</span>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button 
                      id="btn-logout"
                      onClick={() => alert('Sesi Telkomsel SSO Anda aman. Dalam mode internal enterprise.')}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout SSO)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
