import axios from "axios";

export const baseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pdfconverterweb-production.up.railway.app/api/v1/user";

const instance = axios.create({
  baseURL: baseUrl,                  
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;
