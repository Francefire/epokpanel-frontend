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
  const { apiKey, storeUrl } = config;
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
       */
      async get(id: string): Promise<Product | null> {
        // TODO: Implement when Squarespace API is configured
        return null;
      },

      /**
       * Create a new product
       */
      async create(product: Omit<Product, 'id'>): Promise<Product> {
        // TODO: Implement when Squarespace API is configured
        throw new Error('Not implemented');
      },

      /**
       * Update an existing product
       */
      async update(id: string, updates: Partial<Product>): Promise<Product> {
        // TODO: Implement when Squarespace API is configured
        throw new Error('Not implemented');
      },

      /**
       * Delete a product
       */
      async delete(id: string): Promise<void> {
        // TODO: Implement when Squarespace API is configured
        throw new Error('Not implemented');
      },

      /**
       * Bulk update multiple products
       */
      async bulkUpdate(updates: Array<{ id: string; data: Partial<Product> }>): Promise<void> {
        // TODO: Implement when Squarespace API is configured
        throw new Error('Not implemented');
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
