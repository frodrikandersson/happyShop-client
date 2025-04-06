import axios from "axios";
import { IGoogleSearch } from "../models/IGoogleSearch";

export async function googleSearch(query: string, start: number = 1) {
    try {
      const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
          q:  query, start,
          key: process.env.GOOGLE_API_SECRET,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        }
      });
      console.log("Google search service fetched successfully: ", response);
      return response.data as IGoogleSearch;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw new Error("Failed to fetch search results.");
    }
}