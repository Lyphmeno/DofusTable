import { packSizes, type Transaction, type TransactionComputed, type TransactionSummary } from "@/lib/types/transaction";

export const calculateTransaction = (
  transaction: Pick<
    Transaction,
    "buyPackPrice" | "buyPackType" | "quantityBought" | "quantitySold" | "sellPackPrice" | "sellPackType" | "status"
  >
): TransactionComputed => {
  const buyUnitPrice = transaction.buyPackPrice / packSizes[transaction.buyPackType];
  const sellUnitPrice = transaction.sellPackPrice / packSizes[transaction.sellPackType];
  const unitProfit = sellUnitPrice - buyUnitPrice;
  const effectiveQuantitySold =
    transaction.status === "sold" ? Math.min(transaction.quantitySold, transaction.quantityBought) : 0;
  const pendingQuantity = Math.max(transaction.quantityBought - effectiveQuantitySold, 0);
  const totalBuyPrice = buyUnitPrice * transaction.quantityBought;
  const estimatedSellPrice = sellUnitPrice * transaction.quantityBought;
  const realizedSellPrice = sellUnitPrice * effectiveQuantitySold;
  const listingTax = estimatedSellPrice * 0.02;
  const estimatedProfit = estimatedSellPrice - totalBuyPrice - listingTax;
  const pendingProfit = transaction.status === "selling" ? estimatedProfit : 0;
  const realizedProfit = realizedSellPrice - totalBuyPrice - listingTax;
  const closedProfit = transaction.status === "sold" || transaction.status === "unsold" ? realizedProfit : 0;
  const profit = transaction.status === "selling" ? pendingProfit : closedProfit;
  const roi = totalBuyPrice > 0 ? estimatedProfit / totalBuyPrice : 0;
  const pendingRoi = totalBuyPrice > 0 ? pendingProfit / totalBuyPrice : 0;
  const realizedRoi = totalBuyPrice > 0 ? closedProfit / totalBuyPrice : 0;
  const profitRoi = transaction.status === "selling" ? pendingRoi : realizedRoi;

  return {
    buyUnitPrice,
    sellUnitPrice,
    unitProfit,
    totalBuyPrice,
    estimatedSellPrice,
    realizedSellPrice,
    listingTax,
    estimatedProfit,
    pendingProfit,
    realizedProfit,
    closedProfit,
    profit,
    roi,
    profitRoi,
    pendingRoi,
    realizedRoi,
    effectiveQuantitySold,
    pendingQuantity
  };
};

export const summarizeTransactions = (transactions: Transaction[]): TransactionSummary => {
  const totals = transactions.reduce(
    (summary, transaction) => {
      const computed = calculateTransaction(transaction);

      return {
        totalBuyPrice: summary.totalBuyPrice + computed.totalBuyPrice,
        totalSellPrice: summary.totalSellPrice + computed.realizedSellPrice,
        totalProfit: summary.totalProfit + computed.closedProfit,
        pendingProfit: summary.pendingProfit + computed.pendingProfit,
        realizedProfit: summary.realizedProfit + computed.closedProfit,
        roiAccumulator: summary.roiAccumulator + computed.roi,
        stockValue: summary.stockValue + computed.buyUnitPrice * computed.pendingQuantity,
        soldCount: summary.soldCount + (transaction.status === "sold" ? 1 : 0),
        activeCount: summary.activeCount + (transaction.status === "selling" ? 1 : 0)
      };
    },
    {
      totalBuyPrice: 0,
      totalSellPrice: 0,
      totalProfit: 0,
      pendingProfit: 0,
      realizedProfit: 0,
      roiAccumulator: 0,
      stockValue: 0,
      soldCount: 0,
      activeCount: 0
    }
  );

  return {
    totalBuyPrice: totals.totalBuyPrice,
    totalSellPrice: totals.totalSellPrice,
    totalProfit: totals.totalProfit,
    pendingProfit: totals.pendingProfit,
    realizedProfit: totals.realizedProfit,
    averageRoi: transactions.length > 0 ? totals.roiAccumulator / transactions.length : 0,
    stockValue: totals.stockValue,
    soldCount: totals.soldCount,
    activeCount: totals.activeCount
  };
};

export const formatKamas = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(value);
};
