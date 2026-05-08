export type DofusItem = {
  id: number;
  name: string;
  type: string;
  level: number | null;
  iconUrl: string | null;
};

export const DOFUS_ITEMS_DATA_PATH = "/data/dofus-items.json";

export const sortDofusItems = (items: DofusItem[]): DofusItem[] => {
  return [...items].sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name, "fr-FR");

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return a.id - b.id;
  });
};

export const dedupeDofusItems = (items: DofusItem[]): DofusItem[] => {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
};

export const normalizeDofusItems = (items: DofusItem[]): DofusItem[] => {
  return sortDofusItems(dedupeDofusItems(items));
};

export const loadDofusItemsFromCache = async (): Promise<DofusItem[]> => {
  const response = await fetch(DOFUS_ITEMS_DATA_PATH);

  if (!response.ok) {
    throw new Error(`Unable to load Dofus items cache (${response.status})`);
  }

  return response.json() as Promise<DofusItem[]>;
};
