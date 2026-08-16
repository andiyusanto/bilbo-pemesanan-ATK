import React from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  Calendar, 
  User, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { formatRupiah, getStatusBadge } from '../utils/formatters';
import { Order } from '../types';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onApproveOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onApproveOrder,
  onRejectOrder,
}) => {
  if (!order) return null;

  const badge = getStatusBadge(order.status);
  const totalItemQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="order-detail-modal-backdrop" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        id="order-detail-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold bg-[#E60000] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
                Lembar PO Internal
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} mr-1.5`} />
                {badge.label}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white pt-1">
              {order.orderNumber}
            </h3>
            <p className="text-xs text-slate-300">
              ID Sistem: <span className="font-mono">{order.id}</span> • Diajukan: {order.date}
            </p>
          </div>

          <button
            id="btn-close-detail-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Top Meta Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {/* Cabang & Pemohon */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Informasi GraPARI Pemohon
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-[#E60000] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{order.branchName}</span>
                    <p className="text-slate-500 text-[11px]">{order.branchCity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    <strong className="text-slate-800">{order.requesterName}</strong> ({order.requesterRole})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Divisi: {order.department}</span>
                </div>
              </div>
            </div>

            {/* Vendor & Pengiriman */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Vendor Rekanan & Distribusi
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{order.vendorName}</span>
                    <p className="text-slate-500 text-[11px]">Kontrak Pengadaan ATK No: KTR/TSL-ATK/2026</p>
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>No. Resi Pengiriman: <strong className="font-mono text-slate-900">{order.trackingNumber}</strong></span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Estimasi Tiba: <strong className="text-slate-800">{order.estimatedDelivery}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Justification / Notes */}
          {order.notes && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5">
              <div className="font-bold text-amber-900 text-xs mb-0.5">Catatan / Keperluan Pengadaan:</div>
              <p className="text-amber-800 leading-relaxed text-xs">{order.notes}</p>
            </div>
          )}

          {/* Ordered ATK Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#E60000]" />
                Rincian Barang ATK yang Dipesan
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {order.items.length} Macam Barang • Total {totalItemQty} Unit
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-2.5 px-3">Kode SKU</th>
                    <th className="py-2.5 px-3">Nama Barang ATK</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-center">Jumlah</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{item.code}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        {item.notes && <div className="text-[11px] text-slate-500">{item.notes}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.category}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700">{formatRupiah(item.pricePerUnit)}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {item.quantity} <span className="font-normal text-slate-500">{item.unit}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        {formatRupiah(item.pricePerUnit * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/80 border-t border-slate-200 font-bold">
                    <td colSpan={5} className="py-3 px-3 text-right text-slate-700 text-xs uppercase">
                      Total Nilai Pengadaan PO:
                    </td>
                    <td className="py-3 px-3 text-right text-base text-[#E60000] font-extrabold">
                      {formatRupiah(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Workflow & Approval Timeline */}
          {order.approvalHistory && order.approvalHistory.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Riwayat & Jalur Approval GraPARI
              </h4>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {order.approvalHistory.map((step, idx) => {
                  let stepIcon = Clock;
                  let stepColor = 'text-amber-500 bg-amber-50 border-amber-200';
                  if (step.status === 'approved') {
                    stepIcon = CheckCircle2;
                    stepColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                  } else if (step.status === 'rejected') {
                    stepIcon = XCircle;
                    stepColor = 'text-rose-600 bg-rose-50 border-rose-200';
                  }
                  const Icon = stepIcon;

                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${stepColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{step.step}</span>
                          {step.timestamp && (
                            <span className="text-[11px] text-slate-400 font-medium">{step.timestamp}</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Oleh: <span className="font-semibold">{step.approver}</span> ({step.role})
                        </p>
                        {step.comment && (
                          <p className="text-[11px] text-slate-700 mt-1 bg-white p-2 rounded border border-slate-200 italic">
                            "{step.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="btn-print-po"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak / Simpan PDF Lembar PO</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
            {order.status === 'pending' && onApproveOrder && onRejectOrder && (
              <>
                <button
                  id="btn-reject-order-action"
                  onClick={() => onRejectOrder(order.id)}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
                >
                  Tolak Pengajuan
                </button>
                <button
                  id="btn-approve-order-action"
                  onClick={() => onApproveOrder(order.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
                >
                  Setujui & Rilis PO ke Vendor
                </button>
              </>
            )}

            <button
              id="btn-close-modal-bottom"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
