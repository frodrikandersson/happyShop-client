import axios from "axios";
import { IGoogleSearch } from "../models/IGoogleSearch";

export async function googleSearch(query: string, start: number = 1) {
    try {
      console.log('API Key:', process.env.VITE_GOOGLE_API_SECRET);
      console.log('Search Engine ID:', process.env.VITE_GOOGLE_SEARCH_ENGINE_ID);
      const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
          q:  query, start,
          key: "AIzaSyAjPePCnWnx-3Ou6R0nrZl1UyANWdnG6Ig",
          cx: "c6bba88bd408443f0",
        }
      });
      console.log("Google search service fetched successfully: ", response);
      return response.data as IGoogleSearch;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw new Error("Failed to fetch search results.");
    }
}