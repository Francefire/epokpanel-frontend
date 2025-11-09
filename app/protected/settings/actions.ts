"use server";

import { saveApiKeys } from "@/utils/api-keys";
import { revalidatePath } from "next/cache";

export async function saveApiKeysAction(formData: FormData) {
  const apiKey = formData.get("apiKey") as string;
  const storeUrl = formData.get("storeUrl") as string;

  if (!apiKey || !storeUrl) {
    return {
      success: false,
      error: "API Key and Store URL are required",
    };
  }

  // Validate store URL format
  try {
    new URL(storeUrl);
  } catch {
    return {
      success: false,
      error: "Invalid Store URL format",
    };
  }

  const result = await saveApiKeys(apiKey, storeUrl);

  if (result.success) {
    revalidatePath("/protected/settings");
  }

  return result;
}
