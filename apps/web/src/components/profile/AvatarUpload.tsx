'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
}

/**
 * AvatarUpload Component
 *
 * Handles avatar image upload to Supabase Storage and profile update.
 * Includes image preview, upload progress, and error handling.
 */
export default function AvatarUpload({ userId, currentAvatarUrl }: AvatarUploadProps) {
  const { updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploading(true);

      // Upload to server API route
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { avatarUrl: newAvatarUrl } = await response.json();

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: newAvatarUrl });

      setAvatarUrl(newAvatarUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) {
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Update profile to remove avatar
      await updateProfile({ avatar_url: null });
      setAvatarUrl(null);
    } catch (error) {
      console.error('Error removing avatar:', error);
      setError('Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    // Try to get initials from user email or show default
    return '👤';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Display */}
      <div className="relative group">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-aurora-green via-aurora-blue to-aurora-purple p-1">
          <div className="w-full h-full rounded-full overflow-hidden bg-dark-900 flex items-center justify-center">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="User avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl">{getInitials()}</span>
            )}
          </div>
        </div>

        {/* Upload Overlay */}
        {!uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-white text-sm font-semibold"
            >
              Change
            </button>
          </div>
        )}

        {/* Uploading State */}
        {uploading && (
          <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload/Remove Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition text-sm font-medium disabled:opacity-50"
        >
          {avatarUrl ? 'Change' : 'Upload'} Avatar
        </button>
        {avatarUrl && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition text-sm font-medium disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="mt-3 text-red-400 text-sm text-center">{error}</div>}

      {/* Helper Text */}
      <p className="mt-2 text-xs text-gray-500 text-center">JPG, PNG or GIF. Max 5MB.</p>
    </div>
  );
}
