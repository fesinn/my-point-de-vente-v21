
export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  Cashier = 'cashier',
}

export interface Product {
  id: string;
  name: string;
  price: number; // Price TTC
  imageUrl: string;
  category: string;
  stock: number;
  vatRate: number; // e.g., 0.20 for 20%
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class, e.g., 'bg-blue-500'
  imageUrl?: string; // Optional image URL for the category
}

export interface User {
  id: string; // This will be the Firebase Auth UID
  name:string;
  email: string;
  role: UserRole;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HeldTicket {
  id:string;
  timestamp: Date;
  items: CartItem[];
  sellerName?: string;
  discountPercentage: number;
  invoiceId: string; // Store the original invoice ID it was held under
}

export enum ModalType {
  NONE,
  HELD_TICKETS,
  DISCOUNT,
  PRINT_RECEIPT,
  PAYMENT,
  CONFIRM_NEW_INVOICE,      // For "Nouvelle Facture" when cart is dirty
  CONFIRM_CANCEL_CURRENT_WORK, // For "Annuler" button when cart is dirty
  CONFIRM_DELETE_TRANSACTION, // For deleting a completed transaction
}

export interface VatBreakdownItem {
  ht: number;
  tva: number;
}

export interface VatBreakdownMap {
  [key: string]: VatBreakdownItem;
}

export interface CompletedTransaction {
  id: string; // Firestore document ID
  invoiceId: string;
  date: string; // ISO string for easier storage
  items: CartItem[];
  sellerName: string;
  paymentMethod: string;
  roomNumber?: string;
  subTotalTTC: number;
  discountPercentage: number;
  discountAmount: number;
  totalTTC: number;
  totalHT: number;
  totalVAT: number;
  vatBreakdown: VatBreakdownMap; // Updated to use VatBreakdownMap
}

// Enum for view management
export enum AppView {
  POS = 'pos',
  MANAGEMENT = 'management',
  FINANCIAL = 'financial',
}

// For FinancialScreen.tsx
export interface ItemReportData { // Added this interface
  name: string;
  quantity: number;
  averageUnitPriceTTC: number;
  totalSalesTTC: number;
}

export interface AggregatedItemDetail { // This might be redundant now or need adjustment if ItemReportData covers its use
  name: string;
  totalQuantity: number;
  totalSalesTTC: number;
  prices: number[]; 
}

export interface AggregatedItemsMap {
  [key: string]: AggregatedItemDetail; // Or this should now use ItemReportData's structure
}

export interface Currency {
    code: string;
    symbol: string;
}

export interface EstablishmentDetails {
    name: string;
    logoUrl: string; // base64 string
    address1: string;
    address2: string;
    tel: string;
    tvaNumber: string;
    iceNumber: string;
    pointOfSaleName: string;
    currency: Currency;
    welcomeMessage: string;
    thankYouMessage: string;
    footerNote1: string;
    footerNote2: string;
}
