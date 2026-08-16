import React, { useState } from 'react';
import { 
  currentUser as initialUser, 
  currentQuota as initialQuota, 
  catalogItems, 
  initialOrders, 
  allBranches 
} from './data/mockData';
import { Order, UserProfile, BranchQuota } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { RecentOrdersTable } from './components/RecentOrdersTable';
import { OrderDetailModal } from './components/OrderDetailModal';
import { NewOrderModal } from './components/NewOrderModal';
import { CatalogView } from './components/CatalogView';
import { ReportsView } from './components/ReportsView';
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  Info, 
  Menu, 
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { formatRupiah } from './utils/formatters';

export default function App() {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [quota, setQuota] = useState<BranchQuota>(initialQuota);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'new-order' | 'history' | 'catalog' | 'reports'>('dashboard');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Branch switcher handler
  const handleSelectBranch = (branchId: string) => {
    const selectedBranch = allBranches.find(b => b.id === branchId);
    if (selectedBranch) {
      setUser(prev => ({
        ...prev,
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
      }));
      setQuota({
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
        branchCode: selectedBranch.code,
        region: 'Area Telkomsel',
        monthlyBudget: selectedBranch.quota,
        usedBudget: selectedBranch.used,
        period: 'Agustus 2026',
      });
      showToast('Lokasi GraPARI Dialihkan', `Menampilkan data untuk ${selectedBranch.name}`, 'info');
    }
  };

  // Create new order handler
  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setQuota(prev => ({
      ...prev,
      usedBudget: prev.usedBudget + newOrder.totalAmount,
    }));
    showToast(
      'Pengajuan Pesanan Berhasil Dikirim',
      `${newOrder.orderNumber} telah diajukan ke Supervisor dan Vendor PT Mitra Graha Niaga.`,
      'success'
    );
  };

  // Approve order handler
  const handleApproveOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'approved',
          estimatedDelivery: '20 Agu 2026',
          approvalHistory: [
            ...(order.approvalHistory || []),
            {
              step: 'Approval Supervisor & Rilis PO',
              approver: 'Budi Santoso',
              role: 'Spv Customer Touchpoint',
              status: 'approved',
              timestamp: 'Hari ini, Baru saja',
              comment: 'Pengajuan disetujui. PO diteruskan ke vendor untuk dispatching.',
            }
          ]
        };
      }
      return order;
    }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: 'approved' } : null);
    }
    showToast('Pesanan Disetujui', `PO ${orderId} telah disetujui dan diteruskan ke vendor resmi.`, 'success');
  };

  // Reject order handler
  const handleRejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'rejected',
          approvalHistory: [
            ...(order.approvalHistory || []),
            {
              step: 'Verifikasi Supervisor',
              approver: 'Budi Santoso',
              role: 'Spv Customer Touchpoint',
              status: 'rejected',
              timestamp: 'Hari ini, Baru saja',
              comment: 'Pengajuan ditolak. Harap sesuaikan kuota dengan rekap kebutuhan prioritas.',
            }
          ]
        };
      }
      return order;
    }));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
    showToast('Pengajuan Ditolak', `PO ${orderId} ditolak. Notifikasi telah dikirim ke pemohon.`, 'error');
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-red-100 selection:text-[#E60000]">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          id="system-toast"
          className="fixed top-20 right-4 sm:right-8 z-50 bg-white border border-slate-200 shadow-xl rounded-xl p-4 max-w-md flex items-start gap-3 animate-in slide-in-from-top-3 fade-in duration-200"
        >
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <h5 className="text-xs font-bold text-slate-900">{toastMessage.title}</h5>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Enterprise Header */}
      <Header
        user={user}
        activeBranchName={user.branchName}
        allBranches={allBranches}
        onSelectBranch={handleSelectBranch}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
      />

      {/* Mobile Top Navigation Subbar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg"
        >
          <Menu className="w-4 h-4" />
          <span>Menu Navigasi</span>
        </button>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-[#E60000] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Pesan ATK</span>
        </button>
      </div>

      {/* App Body Container: Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              if (tab === 'new-order') {
                setIsNewOrderModalOpen(true);
              } else {
                setCurrentTab(tab);
              }
            }}
            quota={quota}
            pendingCount={pendingCount}
          />
        </div>

        {/* Mobile Slide-over Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full shadow-2xl overflow-y-auto">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Menu Portal ATK</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setMobileSidebarOpen(false);
                  if (tab === 'new-order') {
                    setIsNewOrderModalOpen(true);
                  } else {
                    setCurrentTab(tab);
                  }
                }}
                quota={quota}
                pendingCount={pendingCount}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main id="main-content-area" className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          
          {/* Breadcrumb & Welcome Banner */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                <span>Portal Logistik Telkomsel</span>
                <span>/</span>
                <span className="font-bold text-slate-800 capitalize">
                  {currentTab === 'dashboard' ? 'Dashboard Operasional' : currentTab === 'history' ? 'Riwayat Pesanan' : currentTab === 'catalog' ? 'Katalog ATK' : 'Laporan Anggaran'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {currentTab === 'dashboard' && 'Dashboard Pemesanan ATK GraPARI'}
                {currentTab === 'history' && 'Riwayat & Monitoring Pesanan ATK'}
                {currentTab === 'catalog' && 'Katalog Standardisasi ATK Telkomsel'}
                {currentTab === 'reports' && 'Laporan Utilisasi Anggaran ATK'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cabang: <strong className="text-slate-800">{user.branchName}</strong> ({user.branchRegion})
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex items-center gap-2.5">
              <button
                id="btn-quick-new-order"
                onClick={() => setIsNewOrderModalOpen(true)}
                className="bg-[#E60000] hover:bg-[#CC0000] active:bg-[#B30000] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition duration-150 flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Buat Pesanan Baru</span>
              </button>
            </div>
          </div>

          {/* Conditional Views */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. Statistic Summary Cards */}
              <StatCards
                orders={orders}
                quota={quota}
                onFilterStatus={(status) => {
                  setActiveFilter(status);
                  // Scroll to table smoothly
                  document.getElementById('recent-orders-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* 2. Recent Orders Table */}
              <RecentOrdersTable
                orders={orders}
                onSelectOrder={(order) => setSelectedOrder(order)}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          )}

          {currentTab === 'history' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <RecentOrdersTable
                orders={orders}
                onSelectOrder={(order) => setSelectedOrder(order)}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            </div>
          )}

          {currentTab === 'catalog' && (
            <div className="animate-in fade-in duration-200">
              <CatalogView
                catalog={catalogItems}
                onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
              />
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="animate-in fade-in duration-200">
              <ReportsView
                quota={quota}
                allBranches={allBranches}
              />
            </div>
          )}

        </main>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onApproveOrder={handleApproveOrder}
        onRejectOrder={handleRejectOrder}
      />

      {/* New Order Modal / Creation Wizard */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        catalog={catalogItems}
        user={user}
        quota={quota}
        onCreateOrder={handleCreateOrder}
      />

      {/* Minimal Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E60000]" />
            <span className="font-semibold text-slate-700">PT Telekomunikasi Selular (Telkomsel)</span>
            <span>• Divisi Logistik & Pengadaan Nasional</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Internal Enterprise Procurement Portal • Kerjasama Resmi Vendor ATK PT Mitra Graha Niaga
          </div>
        </div>
      </footer>

    </div>
  );
}
