/**
 * API Key Management
 * Handles secure storage and retrieval of user API keys
 */

import { createClient } from "@/utils/supabase/server";
import { encrypt, decrypt } from "@/utils/crypto";
import { SquarespaceConfig } from "./squarespace/client";

export interface UserApiKeys {
  id?: string;
  user_id: string;
  squarespace_api_key: string; // Encrypted
  squarespace_store_url: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Save user's Squarespace API credentials (encrypted)
 */
export async function saveApiKeys(
  apiKey: string,
  storeUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Encrypt the API key before storing
    const encryptedApiKey = await encrypt(apiKey);

    // Upsert into database
    const { error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: user.id,
        squarespace_api_key: encryptedApiKey,
        squarespace_store_url: storeUrl,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving API keys:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveApiKeys:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get user's Squarespace API credentials (decrypted)
 */
export async function getApiKeys(): Promise<{
  squareSpaceConfig : SquarespaceConfig | null;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { squareSpaceConfig: null, error: 'Not authenticated' };
    }

    // Fetch encrypted data
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('squarespace_api_key, squarespace_store_url')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No records found
        return { squareSpaceConfig: null };
      }
      return { squareSpaceConfig: null, error: error.message };
    }

    if (!data) {
      return { squareSpaceConfig: null };
    }

    // Decrypt the API key
    const decryptedApiKey = await decrypt(data.squarespace_api_key);

    return {
      squareSpaceConfig: {
        apiKey: decryptedApiKey,
        storeUrl: data.squarespace_store_url,
      }
    };
  } catch (error) {
    console.error('Error in getApiKeys:', error);
    return { 
      squareSpaceConfig: null,
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete user's API keys
 */
export async function deleteApiKeys(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
