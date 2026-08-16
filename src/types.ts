export type OrderStatus = 'pending' | 'approved' | 'rejected' | 'shipped' | 'completed';

export interface OrderItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  branchId: string;
  branchName: string;
  branchCity: string;
  requesterName: string;
  requesterRole: string;
  department: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  vendorName: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  approvalHistory?: {
    step: string;
    approver: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    comment?: string;
  }[];
}

export interface CatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stockAvailable: number;
  minOrderQty: number;
  description: string;
  isSpecialGraPARIItem?: boolean;
}

export interface BranchQuota {
  branchId: string;
  branchName: string;
  branchCode: string;
  region: string;
  monthlyBudget: number;
  usedBudget: number;
  period: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Staff GraPARI' | 'Spv Customer Touchpoint' | 'Manager Logistik Regional' | 'Admin Vendor';
  branchId: string;
  branchName: string;
  branchRegion: string;
  avatarUrl?: string;
}
