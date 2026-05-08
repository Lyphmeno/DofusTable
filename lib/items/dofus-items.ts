export type DofusItem = {
  id: number;
  name: string;
  type: string;
  level: number | null;
  iconUrl: string | null;
};

export type SearchableDofusItem = DofusItem & {
  searchName: string;
  searchTokens: string[];
};

export const DOFUS_ITEMS_DATA_PATH = "/data/dofus-items.json";

const stopWords = new Set(["d", "de", "des", "du", "le", "la", "les", "l", "un", "une", "et", "en", "a", "au", "aux"]);

export const normalizeItemSearchText = (value: string): string => {
  return value
    .normalize("NFKD")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "ae")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`-]/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .toLocaleLowerCase("fr-FR")
    .trim();
};

export const getItemSearchTokens = (value: string): string[] => {
  const normalized = normalizeItemSearchText(value);

  if (!normalized) {
    return [];
  }

  return normalized.split(/\s+/).filter((token) => token.length > 0 && !stopWords.has(token));
};

export const toSearchableDofusItem = (item: DofusItem): SearchableDofusItem => {
  return {
    ...item,
    searchName: normalizeItemSearchText(item.name),
    searchTokens: getItemSearchTokens(item.name)
  };
};

export const matchesDofusItemQuery = (item: SearchableDofusItem, query: string): boolean => {
  const queryTokens = getItemSearchTokens(query);

  if (queryTokens.length === 0) {
    return false;
  }

  return getDofusItemQueryScore(item, queryTokens) !== null;
};

export const getDofusItemQueryScore = (item: SearchableDofusItem, queryTokens: string[]): number | null => {
  if (queryTokens.length === 0) {
    return null;
  }

  let score = item.searchTokens.length;

  for (const queryToken of queryTokens) {
    if (item.searchTokens.includes(queryToken)) {
      continue;
    }

    if (item.searchTokens.some((itemToken) => itemToken.startsWith(queryToken))) {
      score += 2;
      continue;
    }

    if (item.searchTokens.some((itemToken) => itemToken.includes(queryToken))) {
      score += 5;
      continue;
    }

    return null;
  }

  return score;
};

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
