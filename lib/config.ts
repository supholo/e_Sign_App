import { setMockApiDelay } from "./config/mockApiConfig"

export const config = {
  useRealApi: false, // Set to true to use the real API, false to use mockDB
  apiBaseUrl: "https://api.example.com", // Replace with your actual API base URL
}

export const setMockDelay = (delay: number) => {
  setMockApiDelay(delay)
}

