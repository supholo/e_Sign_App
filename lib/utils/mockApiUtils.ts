import { mockApiConfig } from "@/lib/config/mockApiConfig"

export const simulateApiDelay = async () => {
  await new Promise((resolve) => setTimeout(resolve, mockApiConfig.delay))
}

