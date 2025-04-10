import axios from "axios";
import { IGoogleSearch } from "../models/IGoogleSearch";

export async function googleSearch(query: string, start: number = 1) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?q=${query}&start=${start}&key=${process.env.VITE_GOOGLE_API_SECRET}&cx=${process.env.VITE_GOOGLE_SEARCH_ENGINE_ID}`;
      const response = await axios.get(url)
      console.log("Google search service fetched successfully: ", response);
      return response.data as IGoogleSearch;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw new Error("Failed to fetch search results.");
    }
}