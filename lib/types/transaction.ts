export const packSizes = {
  unit: 1,
  ten: 10,
  hundred: 100
} as const;

export type PackType = keyof typeof packSizes;

export type TransactionStatus = "selling" | "sold" | "unsold";

export type Transaction = {
  id: string;
  userId: string;
  itemId: number | null;
  itemName: string;
  itemIconUrl: string | null;
  quantityBought: number;
  buyPackType: PackType;
  buyPackPrice: number;
  sellPackType: PackType;
  sellPackPrice: number;
  quantitySold: number;
  status: TransactionStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionInput = {
  itemId?: number | null;
  itemName: string;
  itemIconUrl?: string | null;
  quantityBought: number;
  buyPackType: PackType;
  buyPackPrice: number;
  sellPackType: PackType;
  sellPackPrice: number;
  quantitySold: number;
  status: TransactionStatus;
  notes?: string;
};

export type TransactionComputed = {
  buyUnitPrice: number;
  sellUnitPrice: number;
  unitProfit: number;
  totalBuyPrice: number;
  estimatedSellPrice: number;
  realizedSellPrice: number;
  listingTax: number;
  estimatedProfit: number;
  pendingProfit: number;
  realizedProfit: number;
  closedProfit: number;
  profit: number;
  roi: number;
  profitRoi: number;
  pendingRoi: number;
  realizedRoi: number;
  effectiveQuantitySold: number;
  pendingQuantity: number;
};

export type TransactionSummary = {
  totalBuyPrice: number;
  totalSellPrice: number;
  totalProfit: number;
  pendingProfit: number;
  realizedProfit: number;
  averageRoi: number;
  stockValue: number;
  soldCount: number;
  activeCount: number;
};
