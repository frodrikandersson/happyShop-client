import axios from "axios";
import { IGoogleSearch } from "../models/IGoogleSearch";

const apiKey = import.meta.env.VITE_GOOGLE_API_SECRET;
const searchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

export async function googleSearch(query: string, start: number = 1) {
    try {
      const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
          q:  query, start,
          key: apiKey,
          cx: searchEngineId,
        }
      });
      console.log("Google search service fetched successfully: ", response);
      return response.data as IGoogleSearch;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw new Error("Failed to fetch search results.");
    }
}