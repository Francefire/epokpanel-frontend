"use server";

import type { Product } from "@/utils/squarespace/client";
import { getSquarespaceClient } from "@/utils/squarespace/get-client";

export async function updateProduct(id: string, field: string, value: any): Promise<void> {
  const client = await getSquarespaceClient();
  
  // Map field to API update structure
  const updates: Partial<Product> = {};
  
  switch (field) {
    case "name":
      updates.name = value;
      break;
    case "isVisible":
      updates.isVisible = value;
      break;
    case "tags":
      updates.tags = value;
      break;
    case "categories":
      updates.categories = value;
      break;
    case "price":
      // Note: Price updates require variant-specific API calls
      // This is a placeholder - actual implementation depends on Squarespace API
      console.log(`Update price for product ${id} to ${value}`);
      break;
    case "stock":
      // Note: Stock updates require variant-specific API calls
      console.log(`Update stock for product ${id} to ${value}`);
      break;
    default:
      throw new Error(`Unsupported field: ${field}`);
  }
  
  if (Object.keys(updates).length > 0) {
    await client.products.update(id, updates);
  }
}

export async function bulkUpdateVisibility(
  productIds: string[],
  isVisible: boolean
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
  const results = { success: [] as string[], failed: [] as Array<{ id: string; error: string }> };
  
  // Process updates in parallel with error handling
  await Promise.allSettled(
    productIds.map(async (id) => {
      try {
        await updateProduct(id, "isVisible", isVisible);
        results.success.push(id);
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })
  );
  
  return results;
}

export async function bulkUpdatePrices(
  productIds: string[],
  adjustment: { type: "percent" | "fixed"; value: number }
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
  const results = { success: [] as string[], failed: [] as Array<{ id: string; error: string }> };
  
  // Note: This requires fetching products first to calculate new prices
  // Placeholder for actual implementation
  console.log(`Bulk price update: ${adjustment.type} ${adjustment.value} for ${productIds.length} products`);
  
  return results;
}

export async function bulkDeleteProducts(
  productIds: string[]
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
  const results = { success: [] as string[], failed: [] as Array<{ id: string; error: string }> };
  
  const client = await getSquarespaceClient();
  
  await Promise.allSettled(
    productIds.map(async (id) => {
      try {
        await client.products.delete(id);
        results.success.push(id);
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })
  );
  
  return results;
}

export async function bulkUpdateTags(
  productIds: string[],
  action: "add" | "remove",
  tags: string[]
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
  const results = { success: [] as string[], failed: [] as Array<{ id: string; error: string }> };
  
  const client = await getSquarespaceClient();
  
  // Fetch products in batches of 50 to get current tags
  const batches: string[][] = [];
  for (let i = 0; i < productIds.length; i += 50) {
    batches.push(productIds.slice(i, i + 50));
  }
  
  // Fetch all products
  const productsMap = new Map<string, Product>();
  try {
    for (const batch of batches) {
      const products = await client.products.getMany(batch);
      products.forEach((p) => productsMap.set(p.id, p));
    }
  } catch (error) {
    // If batch fetch fails, fall back to individual fetches
    await Promise.allSettled(
      productIds.map(async (id) => {
        const product = await client.products.get(id);
        if (product) productsMap.set(id, product);
      })
    );
  }
  
  // Update tags for each product
  await Promise.allSettled(
    productIds.map(async (id) => {
      try {
        const product = productsMap.get(id);
        if (!product) {
          throw new Error(`Product not found: ${id}`);
        }
        
        const currentTags = product.tags || [];
        
        let newTags: string[];
        if (action === "add") {
          newTags = [...new Set([...currentTags, ...tags])];
        } else {
          newTags = currentTags.filter((tag) => !tags.includes(tag));
        }
        
        await updateProduct(id, "tags", newTags);
        results.success.push(id);
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })
  );
  
  return results;
}

export async function bulkUpdateCategories(
  productIds: string[],
  action: "add" | "remove",
  categories: string[]
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> {
  const results = { success: [] as string[], failed: [] as Array<{ id: string; error: string }> };
  
  const client = await getSquarespaceClient();
  
  // Fetch products in batches of 50 to get current categories
  const batches: string[][] = [];
  for (let i = 0; i < productIds.length; i += 50) {
    batches.push(productIds.slice(i, i + 50));
  }
  
  // Fetch all products
  const productsMap = new Map<string, Product>();
  try {
    for (const batch of batches) {
      const products = await client.products.getMany(batch);
      products.forEach((p) => productsMap.set(p.id, p));
    }
  } catch (error) {
    // If batch fetch fails, fall back to individual fetches
    await Promise.allSettled(
      productIds.map(async (id) => {
        const product = await client.products.get(id);
        if (product) productsMap.set(id, product);
      })
    );
  }
  
  // Update categories for each product
  await Promise.allSettled(
    productIds.map(async (id) => {
      try {
        const product = productsMap.get(id);
        if (!product) {
          throw new Error(`Product not found: ${id}`);
        }
        
        const currentCategories = product.categories || [];
        
        let newCategories: string[];
        if (action === "add") {
          newCategories = [...new Set([...currentCategories, ...categories])];
        } else {
          newCategories = currentCategories.filter((cat) => !categories.includes(cat));
        }
        
        await updateProduct(id, "categories", newCategories);
        results.success.push(id);
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })
  );
  
  return results;
}
