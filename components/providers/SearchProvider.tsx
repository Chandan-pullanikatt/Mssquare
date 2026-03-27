"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  // Clear search query when changing main sections
  useEffect(() => {
    // We only clear if the top-level path changes significantly
    // or you can choose to clear it on every navigation
    setSearchQuery("");
  }, [pathname]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    // Return a fallback if used outside provider, to avoid crashes
    return {
      searchQuery: "",
      setSearchQuery: () => {},
      clearSearch: () => {}
    };
  }
  return context;
}
