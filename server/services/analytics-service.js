import { config } from "../config.js";
import { buildOverview } from "../repository.js";

export async function getAnalytics() {
  try {
    const response = await fetch(`${config.pythonServiceUrl}/analytics`, { signal: AbortSignal.timeout(1500) });
    if (!response.ok) throw new Error("Python service unavailable");
    return response.json();
  } catch {
    return { source: "node-fallback", ...buildOverview() };
  }
}
