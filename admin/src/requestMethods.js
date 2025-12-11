import axios from "axios";

const BASE_URL = "http://localhost:8000/api/V1/";

export const userRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
