/**
 * Squarespace API Client
 * 
 * This client handles all interactions with the Squarespace API.
 * Follow the Supabase client pattern - create instances as needed, not globally.
 */

export interface SquarespaceConfig {
  apiKey: string;
  storeUrl: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  pricing: {
    basePrice: {
      currency: string;
      value: string;
    };
    salePrice?: {
      currency: string;
      value: string;
    };
    onSale: boolean;
  };
  stock?: {
    quantity: number;
    unlimited: boolean;
  };
  attributes?: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Product {
  modifiedAt: string;
  updatedAt: string;
  id: string;
  type: 'PHYSICAL' | 'DIGITAL';
  storePageId: string;
  name: string;
  description: string; // HTML content
  url: string;
  urlSlug: string;
  variants: ProductVariant[];
  images: ProductImage[];
  isVisible: boolean;
  tags?: string[];
  categories?: string[];
  seoOptions?: {
    title?: string;
    description?: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    hasNextPage: boolean;
    nextPageCursor?: string;
    nextPageUrl?: string;
  };
}

export interface GetProductsParams {
  type?: string; // 'PHYSICAL' or 'DIGITAL' or 'PHYSICAL,DIGITAL'
  cursor?: string;
  modifiedAfter?: string;
  modifiedBefore?: string;
}

export interface ProductTemplate {
  type: 'painting' | 'sculpture';
  categories: string[];
  tags: string[];
  defaultStock: number;
}

/**
 * Create a Squarespace API client instance
 * @param config - API configuration
 */
export function createSquarespaceClient(config: SquarespaceConfig) {
  const { apiKey } = config;
  const baseApiUrl = `https://api.squarespace.com/v2`

  // Base API request helper
  async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${baseApiUrl}/${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent':'EpokPanelFrontend/1.0',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Squarespace API error: ${response.statusText}`);
    }

    return response.json();
  }

  return {
    // Product operations
    products: {
      /**
       * Get all products with optional filtering and pagination
       */
      async list(params?: GetProductsParams): Promise<ProductsResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.type) {
          queryParams.append('type', params.type);
        } else if (!params?.cursor) {
          // Default to both types if no cursor and no type specified
          queryParams.append('type', 'PHYSICAL,DIGITAL');
        }
        
        if (params?.cursor) {
          queryParams.append('cursor', params.cursor);
        }
        
        if (params?.modifiedAfter && params?.modifiedBefore) {
          queryParams.append('modifiedAfter', params.modifiedAfter);
          queryParams.append('modifiedBefore', params.modifiedBefore);
        }
        
        const endpoint = `commerce/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return await apiRequest<ProductsResponse>(endpoint);
      },

      /**
       * Get all products (all pages) - convenience method
       */
      async listAll(type: string = 'PHYSICAL,DIGITAL'): Promise<Product[]> {
        const allProducts: Product[] = [];
        let cursor: string | undefined;
        
        do {
          const response = await this.list({ type, cursor });
          allProducts.push(...response.products);
          cursor = response.pagination.nextPageCursor;
        } while (cursor);
        
        return allProducts;
      },

      /**
       * Get a single product by ID
       * @param id - Product ID
       * @returns Product or null if not found
       * @throws {Error} 404 - Product not found
       */
      async get(id: string): Promise<Product | null> {
        try {
          const response = await apiRequest<{ products: Product[] }>(
            `commerce/products/${id}`
          );
          return response.products[0] || null;
        } catch (error) {
          if (error instanceof Error && error.message.includes('404')) {
            return null;
          }
          throw error;
        }
      },

      /**
       * Get multiple products by IDs (up to 50)
       * @param ids - Array of product IDs (max 50)
       * @returns Array of products
       * @throws {Error} 400 - More than 50 IDs requested
       * @throws {Error} 404 - One or more IDs not found
       */
      async getMany(ids: string[]): Promise<Product[]> {
        if (ids.length > 50) {
          throw new Error('Cannot retrieve more than 50 products at once');
        }
        
        const response = await apiRequest<{ products: Product[] }>(
          `commerce/products/${ids.join(',')}`
        );
        return response.products;
      },

      /**
       * Create a new product
       */
      async create(product: Omit<Product, 'id'>): Promise<Product> {
        // TODO: Implement when Squarespace API is configured
        console.log(product)
        throw new Error('Not implemented');
      },

      /**
       * Update an existing product
       * Note: Cannot add/remove images or update variants via this endpoint
       * @param id - Product ID
       * @param updates - Partial product data to update
       * @returns Updated product
       * @throws {Error} 400 - Invalid request body
       * @throws {Error} 404 - Product not found
       * @throws {Error} 405 - Not a PHYSICAL product
       * @throws {Error} 409 - Conflict (e.g., URL slug in use)
       */
      async update(id: string, updates: Partial<Product>): Promise<Product> {
        // Filter out fields that cannot be updated via this endpoint
        const { ...updateData } = updates;
        
        try {
          return await apiRequest<Product>(
            `commerce/products/${id}`,
            {
              method: 'POST',
              body: JSON.stringify(updateData),
            }
          );
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to update product ${id}: ${error.message}`);
          }
          throw error;
        }
      },

      /**
       * Delete a product
       */
      async delete(id: string): Promise<void> {
        console.log(id)
        throw new Error('Not implemented');
      },

      /**
       * Bulk update multiple products
       * @param updates - Array of product IDs and their update data
       * @returns Promise that resolves when all updates complete
       */
      async bulkUpdate(updates: Array<{ id: string; data: Partial<Product> }>): Promise<void> {
        // Execute all updates in parallel
        await Promise.all(
          updates.map(({ id, data }) => this.update(id, data))
        );
      },
    },

    // Template operations
    templates: {
      /**
       * Create a product from a template
       * Note: Templates will be implemented when the Squarespace product creation API is available
       */
      async createFromTemplate(
        template: ProductTemplate,
        productData: Partial<Product>
      ): Promise<Product> {
        // TODO: Implement product creation with templates
        // This will require mapping template data to Squarespace API format
        console.log(getTemplateDefaults("painting"));
        console.log(getTemplateDefaults("sculpture"));

        console.log(template, productData)
        throw new Error('Product creation from templates not yet implemented');
      },
    },
  };
}

/**
 * Get default settings for a product template
 */
function getTemplateDefaults(type: 'painting' | 'sculpture'): ProductTemplate {
  const templates: Record<string, ProductTemplate> = {
    painting: {
      type: 'painting',
      categories: ['Art', 'Paintings'],
      tags: ['artwork', 'painting'],
      defaultStock: 1,
    },
    sculpture: {
      type: 'sculpture',
      categories: ['Art', 'Sculptures'],
      tags: ['artwork', 'sculpture'],
      defaultStock: 1,
    },
  };

  return templates[type];
}

/**
 * Validate Squarespace API configuration
 */
export function validateConfig(config: Partial<SquarespaceConfig>): boolean {
  return !!(config.apiKey && config.storeUrl);
}
