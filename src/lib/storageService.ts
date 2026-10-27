import { supabase, isSupabaseConfigured } from './supabaseClient';

export const MEDIA_BUCKET_NAME = 'eusatis-media';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Service to handle uploads, storage, and retrieval of media assets via Supabase Storage
 */
export const storageService = {
  /**
   * Upload an image file to Supabase Storage in the designated folder.
   * Requires an authenticated session.
   *
   * @param file The file to upload
   * @param folder Destination subdirectory ('lessons' | 'episodes' | 'stories' | 'site')
   * @returns Public URL of the uploaded image
   */
  async uploadMediaFile(
    file: File,
    folder: 'lessons' | 'episodes' | 'stories' | 'site' = 'lessons'
  ): Promise<string> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Storage uploads require a connected Supabase instance.');
    }

    // Verify session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      throw new Error('Authentication required: You must be signed in as an administrator to upload media assets.');
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a JPEG, PNG, WebP, SVG, or GIF.`);
    }

    // Max 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 10MB.`);
    }

    // Sanitize file name
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const filePath = `${folder}/${uniqueId}-${sanitizedName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      if (uploadError.message?.toLowerCase().includes('bucket not found')) {
        throw new Error(
          `Storage bucket "${MEDIA_BUCKET_NAME}" does not exist in your Supabase project yet. Please run the SQL migration script from supabase/migrations/ to create the bucket.`
        );
      }
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate public URL for the uploaded media asset.');
    }

    return urlData.publicUrl;
  },

  /**
   * Safely deletes a file from the media bucket if it was previously hosted there.
   */
  async deleteMediaFile(publicUrlOrPath: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase || !publicUrlOrPath) return;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;

      // Extract path from public URL if full URL is passed
      let path = publicUrlOrPath;
      const marker = `/storage/v1/object/public/${MEDIA_BUCKET_NAME}/`;
      if (publicUrlOrPath.includes(marker)) {
        path = publicUrlOrPath.split(marker)[1];
      }

      if (path && !path.startsWith('http') && !path.startsWith('/src/')) {
        await supabase.storage.from(MEDIA_BUCKET_NAME).remove([path]);
      }
    } catch (err) {
      console.warn('Non-fatal error cleaning up media asset:', err);
    }
  }
};
