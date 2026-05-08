import type { PackType, TransactionInput, TransactionStatus } from "@/lib/types/transaction";

const packTypes: PackType[] = ["unit", "ten", "hundred"];
const transactionStatuses: TransactionStatus[] = ["selling", "sold", "unsold"];

const getString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const getNumber = (formData: FormData, key: string) => {
  const value = Number(getString(formData, key));
  return Number.isFinite(value) ? value : 0;
};

const getOptionalNumber = (formData: FormData, key: string) => {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

const getOptionalString = (formData: FormData, key: string) => {
  const value = getString(formData, key);
  return value.length > 0 ? value : null;
};

const getPackType = (formData: FormData, key: string): PackType => {
  const value = getString(formData, key);
  return packTypes.includes(value as PackType) ? (value as PackType) : "unit";
};

const getStatus = (formData: FormData): TransactionStatus => {
  const value = getString(formData, "status");
  return transactionStatuses.includes(value as TransactionStatus) ? (value as TransactionStatus) : "selling";
};

export const parseTransactionFormData = (formData: FormData): TransactionInput => {
  return {
    itemId: getOptionalNumber(formData, "itemId"),
    itemName: getString(formData, "itemName"),
    itemIconUrl: getOptionalString(formData, "itemIconUrl"),
    quantityBought: getNumber(formData, "quantityBought"),
    buyPackType: getPackType(formData, "buyPackType"),
    buyPackPrice: getNumber(formData, "buyPackPrice"),
    sellPackType: getPackType(formData, "sellPackType"),
    sellPackPrice: getNumber(formData, "sellPackPrice"),
    quantitySold: getNumber(formData, "quantitySold"),
    status: getStatus(formData),
    notes: getString(formData, "notes")
  };
};

export const toTransactionInsert = (input: TransactionInput, userId: string) => {
  return {
    user_id: userId,
    item_id: input.itemId,
    item_name: input.itemName,
    item_icon_url: input.itemIconUrl,
    quantity_bought: input.quantityBought,
    buy_pack_type: input.buyPackType,
    buy_pack_price: input.buyPackPrice,
    sell_pack_type: input.sellPackType,
    sell_pack_price: input.sellPackPrice,
    quantity_sold: input.quantitySold,
    status: input.status,
    notes: input.notes?.trim() ? input.notes.trim() : null
  };
};

export const toTransactionUpdate = (input: TransactionInput) => {
  return {
    item_id: input.itemId,
    item_name: input.itemName,
    item_icon_url: input.itemIconUrl,
    quantity_bought: input.quantityBought,
    buy_pack_type: input.buyPackType,
    buy_pack_price: input.buyPackPrice,
    sell_pack_type: input.sellPackType,
    sell_pack_price: input.sellPackPrice,
    quantity_sold: input.quantitySold,
    status: input.status,
    notes: input.notes?.trim() ? input.notes.trim() : null
  };
};
