import axios from "axios";

export const baseUrl = "http://localhost:3000/api/v1/user";

const instance = axios.create({
  baseURL: baseUrl,                  
  headers: {
    "Content-Type": "application/json"
  }
});

export default instance;

