"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseTransactionFormData, toTransactionInsert, toTransactionUpdate } from "@/lib/transactions/form-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const getAuthenticatedUserId = async () => {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect("/login");
  }

  return {
    supabase,
    userId: user.id
  };
};

export const createTransactionAction = async (formData: FormData) => {
  const { supabase, userId } = await getAuthenticatedUserId();
  const input = {
    ...parseTransactionFormData(formData),
    quantitySold: 0,
    status: "selling" as const,
    notes: ""
  };

  if (!input.itemName || input.quantityBought <= 0) {
    return;
  }

  await supabase.from("transactions").insert(toTransactionInsert(input, userId));

  revalidatePath("/");
};

export const updateTransactionAction = async (formData: FormData) => {
  const { supabase } = await getAuthenticatedUserId();
  const id = formData.get("id");
  const input = parseTransactionFormData(formData);
  const status = input.status;
  const quantitySold = status === "selling" || status === "unsold" ? 0 : input.quantitySold;
  const sanitizedInput = {
    ...input,
    quantitySold,
    status
  };

  if (typeof id !== "string" || !id || !sanitizedInput.itemName || sanitizedInput.quantitySold > sanitizedInput.quantityBought) {
    return;
  }

  await supabase.from("transactions").update(toTransactionUpdate(sanitizedInput)).eq("id", id);

  revalidatePath("/");
};

export const updateTransactionFieldAction = async (formData: FormData) => {
  const { supabase } = await getAuthenticatedUserId();
  const id = formData.get("id");
  const field = formData.get("field");
  const value = formData.get("value");

  if (typeof id !== "string" || !id || typeof field !== "string") {
    return;
  }

  const allowedFields: Record<string, string> = {
    itemName: "item_name",
    quantityBought: "quantity_bought",
    quantitySold: "quantity_sold",
    buyPackType: "buy_pack_type",
    sellPackType: "sell_pack_type",
    buyPackPrice: "buy_pack_price",
    sellPackPrice: "sell_pack_price",
    status: "status"
  };

  const column = allowedFields[field];

  if (!column || typeof value !== "string") {
    return;
  }

  const nextValue = ["quantityBought", "quantitySold", "buyPackPrice", "sellPackPrice"].includes(field)
    ? Number(value)
    : value;

  if (typeof nextValue === "number" && (!Number.isFinite(nextValue) || nextValue < 0)) {
    return;
  }

  if (field === "status" && !["selling", "sold", "unsold"].includes(value)) {
    return;
  }

  if ((field === "buyPackType" || field === "sellPackType") && !["unit", "ten", "hundred"].includes(value)) {
    return;
  }

  let patch: Record<string, string | number> = { [column]: nextValue };

  if (field === "status" && (value === "selling" || value === "unsold")) {
    patch = { [column]: nextValue, quantity_sold: 0 };
  }

  if (field === "status" && value === "sold") {
    const { data } = await supabase.from("transactions").select("quantity_bought").eq("id", id).maybeSingle();
    const quantityBought = Number(data?.quantity_bought ?? 0);
    patch = { [column]: nextValue, quantity_sold: quantityBought };
  }

  await supabase.from("transactions").update(patch).eq("id", id);

  revalidatePath("/");
};

export const deleteTransactionAction = async (formData: FormData) => {
  const { supabase } = await getAuthenticatedUserId();
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  await supabase.from("transactions").delete().eq("id", id);

  revalidatePath("/");
};
