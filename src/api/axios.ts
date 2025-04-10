import axios from "axios";

const api = axios.create({
    baseURL: "https://happy-shop-api.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;