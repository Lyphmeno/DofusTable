"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  getItemSearchTokens,
  getDofusItemQueryScore,
  loadDofusItemsFromCache,
  toSearchableDofusItem,
  type DofusItem,
  type SearchableDofusItem
} from "@/lib/items/dofus-items";
import { cn } from "@/lib/utils/cn";

type ItemComboboxProps = {
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  labelClassName?: string;
  maxResults?: number;
  name?: string;
  onQueryChange?: (query: string) => void;
  onSelect: (item: DofusItem) => void;
  placeholder?: string;
  inputClassName?: string;
  value?: DofusItem | null;
};

const defaultMaxResults = 15;
const debounceDelay = 120;

export const ItemCombobox = ({
  className,
  disabled = false,
  id,
  label = "Item",
  labelClassName,
  maxResults = defaultMaxResults,
  name,
  onQueryChange,
  onSelect,
  placeholder = "Rechercher un item",
  inputClassName,
  value
}: ItemComboboxProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<SearchableDofusItem[]>([]);
  const [query, setQuery] = useState(value?.name ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(value?.name ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    loadDofusItemsFromCache()
      .then((cachedItems) => {
        if (!ignore) {
          setItems(cachedItems.map(toSearchableDofusItem));
          setError(null);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Cache items indisponible");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setQuery(value?.name ?? "");
    setDebouncedQuery(value?.name ?? "");
  }, [value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const results = useMemo(() => {
    const queryTokens = getItemSearchTokens(debouncedQuery);

    if (debouncedQuery.trim().length < 2 || queryTokens.length === 0) {
      return [];
    }

    return items
      .map((item) => ({
        item,
        score: getDofusItemQueryScore(item, queryTokens)
      }))
      .filter((result): result is { item: SearchableDofusItem; score: number } => result.score !== null)
      .sort((a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name, "fr-FR"))
      .slice(0, Math.max(1, maxResults))
      .map((result) => result.item);
  }, [debouncedQuery, items, maxResults]);

  const selectItem = (item: DofusItem) => {
    setQuery(item.name);
    setDebouncedQuery(item.name);
    setIsOpen(false);
    onSelect(item);
  };

  return (
    <div className={cn("relative min-w-0", className)} ref={containerRef}>
      {label ? (
        <label className={cn("block text-xs font-medium text-muted-foreground", labelClassName)} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label={label}
          autoComplete="off"
          className={cn(
            "mt-1 h-9 w-full min-w-0 rounded-md border border-border bg-input pl-8 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary",
            inputClassName
          )}
          disabled={disabled}
          id={inputId}
          name={name}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            onQueryChange?.(nextQuery);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required
          role="combobox"
          type="text"
          value={query}
        />
      </div>

      {isOpen ? (
        <div
          className="absolute z-30 mt-1 max-h-80 w-full overflow-hidden rounded-md border border-border bg-surface shadow-soft"
          id={listboxId}
          role="listbox"
        >
          {isLoading ? <ComboboxMessage>Chargement...</ComboboxMessage> : null}
          {error ? <ComboboxMessage>{error}</ComboboxMessage> : null}
          {!isLoading && !error && items.length === 0 ? (
            <ComboboxMessage>Liste d&apos;items non generee. Lance npm run sync:items.</ComboboxMessage>
          ) : null}
          {!isLoading && !error && items.length > 0 && debouncedQuery.trim().length > 0 && debouncedQuery.trim().length < 2 ? (
            <ComboboxMessage>Entrez au moins 2 caracteres.</ComboboxMessage>
          ) : null}
          {!isLoading && !error && items.length > 0 && debouncedQuery.trim().length >= 2 && results.length === 0 ? (
            <ComboboxMessage>Aucun item trouve.</ComboboxMessage>
          ) : null}
          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((item) => (
                <li key={item.id} role="option">
                  <button
                    className="flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left text-sm transition hover:bg-surface-soft focus:bg-surface-soft focus:outline-none"
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={() => selectItem(item)}
                    title={item.name}
                    type="button"
                  >
                    <ItemIcon item={item} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">{item.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.type}
                        {item.level !== null ? ` - niv. ${item.level}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

type ComboboxMessageProps = {
  children: string;
};

const ComboboxMessage = ({ children }: ComboboxMessageProps) => {
  return <p className="px-3 py-2 text-xs text-muted-foreground">{children}</p>;
};

type ItemIconProps = {
  item: DofusItem;
};

const ItemIcon = ({ item }: ItemIconProps) => {
  if (!item.iconUrl) {
    return <span className="h-6 w-6 shrink-0 rounded-md border border-border-soft bg-surface-soft" aria-hidden="true" />;
  }

  return (
    <Image
      alt=""
      className="h-6 w-6 shrink-0 rounded-md object-contain"
      height={24}
      loading="lazy"
      src={item.iconUrl}
      unoptimized
      width={24}
    />
  );
};
