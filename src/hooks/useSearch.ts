import { useState } from "react";
import { googleSearch } from "../services/searchService";

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSearch = async (query: string, start: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const searchData = await googleSearch(query, start);
      return searchData;
    } catch (error) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  }

  return { handleGetSearch, loading, error };
};
