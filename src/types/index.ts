
// Auth types
export type UserRole = 'admin' | 'manager' | 'employee' | 'staff';
export type LanguageType = 'en' | 'si' | 'ta';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  language: LanguageType;
  status: UserStatus;
  createdAt: Date;
  phone?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// UI types
export interface SidebarLink {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  roles?: UserRole[];
}

// Inventory types
export type UnitOfMeasure = 'units' | 'kg' | 'liters' | 'meters' | 'pieces';
export type AdjustmentReason = 'damage' | 'counting_error' | 'return' | 'theft' | 'production' | 'other';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  unitOfMeasure: UnitOfMeasure;
  purchaseCost: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  isActive: boolean;
  imageUrl?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryAdjustment {
  id: string;
  itemId: string;
  previousQuantity: number;
  newQuantity: number;
  reason: AdjustmentReason;
  notes?: string;
  createdBy: string;
  adjustmentDate: Date;
  item: InventoryItem;
}

// Manufacturing types
export interface Material {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  costPerUnit?: number;
  item?: InventoryItem;
}

export interface BOM {
  id: string;
  name?: string;
  productName: string;
  description: string;
  materials: Material[];
  finishedItemId?: string;
  createdAt: Date;
  updatedAt?: Date;
  totalCost?: number;
  notes?: string;
}

export type ProductionStatus = 'planned' | 'in_progress' | 'in-progress' | 'completed' | 'cancelled';

export interface ProductionOrder {
  id: string;
  bomId: string;
  bom?: BOM;
  quantityToProduce: number;
  status: ProductionStatus;
  startDate: Date;
  laborHours?: number;
  laborCost: number;
  additionalCosts: number;
  materialsIssued?: boolean;
  totalCost?: number;
  batchId?: string;
  createdAt: Date;
  completionDate?: Date;
  orderNumber?: string;
  notes?: string;
}

// Sales types
export type SalesOrderStatus = 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'bank' | 'internal';
export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  product: InventoryItem;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  items: SaleItem[];
  status: SalesOrderStatus;
  orderDate: Date;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  createdAt: Date;
}

// Report types
export interface ReportFilter {
  startDate: Date;
  endDate: Date;
  category?: string;
  customer?: string;
  supplier?: string;
  product?: string;
}

export interface DashboardSummary {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
  lowStockItems: number;
  pendingOrders: number;
}

export interface SalesReport {
  id: string;
  date: Date;
  customer: string;
  productName: string;
  quantity: number;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface InventoryReport {
  id: string;
  date: Date;
  itemName: string;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  adjustedBy: string;
}

export interface FinancialReport {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}

// Add ValueType for chart components
export type ValueType = string | number;

// General types
export interface StockMovement {
  id: string;
  itemId: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'production' | 'return';
  quantity: number;
  documentRef?: string;
  notes?: string;
  createdAt: Date;
  createdBy?: string;
}

// Procurement types
export interface Supplier {
  id: string;
  name: string;
  telephone: string;
  address: string;
  paymentTerms: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: Supplier;
  items: PurchaseItem[];
  status: 'draft' | 'sent' | 'received' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt?: Date;
  expectedDeliveryDate?: Date;
  notes?: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

export interface GoodsReceipt {
  id: string;
  purchaseOrderId: string;
  receiptNumber: string;
  items: GoodsReceiptItem[];
  receivedDate: Date;
  notes?: string;
}

export interface GoodsReceiptItem {
  id: string;
  purchaseItemId: string;
  receivedQuantity: number;
  notes?: string;
}

// Sales types
export interface Customer {
  id: string;
  name: string;
  telephone: string;
  address: string;
  email?: string;
  createdAt: Date;
}

export interface SalesOrderItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  salesOrderId: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: Date;
  paidAt?: Date;
}

export interface SalesReturn {
  id: string;
  salesOrderId: string;
  returnNumber: string;
  items: SalesReturnItem[];
  reason: string;
  total: number;
  createdAt: Date;
}

export interface SalesReturnItem {
  id: string;
  salesOrderItemId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Financial types
export interface FinancialCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description?: string;
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'received' | 'completed' | 'cancelled';
