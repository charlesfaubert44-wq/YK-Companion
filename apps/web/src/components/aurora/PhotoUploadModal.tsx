'use client';

import { useState } from 'react';
import { AuroraPhoto, UploadPhotoInput } from '@/types/aurora.types';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  eventId: string;
  onClose: () => void;
  onPhotoUploaded: (photo: AuroraPhoto) => void;
}

export default function PhotoUploadModal({ eventId, onClose, onPhotoUploaded }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<UploadPhotoInput>>({
    event_id: eventId,
    caption: '',
    location_name: '',
    iso: undefined,
    shutter_speed: '',
    aperture: '',
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to upload photos');
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Replace with actual Supabase upload
    const newPhoto: AuroraPhoto = {
      id: crypto.randomUUID(),
      event_id: eventId,
      user_id: user.id,
      photo_url: '/uploaded-photo.jpg',
      thumbnail_url: null,
      caption: formData.caption || null,
      location_lat: null,
      location_lng: null,
      location_name: formData.location_name || null,
      camera_model: formData.camera_model || null,
      iso: formData.iso || null,
      shutter_speed: formData.shutter_speed || null,
      aperture: formData.aperture || null,
      focal_length: null,
      taken_at: new Date().toISOString(),
      uploaded_at: new Date().toISOString(),
      likes_count: 0,
      featured: false,
      quality_score: 7 + Math.floor(Math.random() * 3),
      approved: true,
      flagged: false,
      created_at: new Date().toISOString(),
      photographer_name: user.email?.split('@')[0] || 'Aurora Chaser',
    };

    onPhotoUploaded(newPhoto);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-dark-900 rounded-2xl max-w-2xl w-full border-2 border-aurora-green/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-green to-aurora-blue bg-clip-text text-transparent mb-2">
                📸 Upload Your Aurora Photo
              </h2>
              <p className="text-gray-400">
                Share your capture with the community and be part of tonight's mosaic!
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-white font-semibold mb-2">Photo *</label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-aurora-green/50 transition-colors cursor-pointer bg-dark-800">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">JPEG, PNG up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  // Handle file upload
                }}
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-white font-semibold mb-2">Caption</label>
            <textarea
              value={formData.caption}
              onChange={e => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Describe your aurora experience..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-white font-semibold mb-2">Location</label>
            <input
              type="text"
              value={formData.location_name}
              onChange={e => setFormData({ ...formData, location_name: e.target.value })}
              placeholder="e.g., Frame Lake, Ingraham Trail Km 5"
              className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Where did you capture this photo?</p>
          </div>

          {/* Camera Settings (Optional) */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Camera Settings (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.iso || ''}
                onChange={e =>
                  setFormData({ ...formData, iso: parseInt(e.target.value) || undefined })
                }
                placeholder="ISO (e.g., 3200)"
                className="px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              />
              <input
                type="text"
                value={formData.shutter_speed || ''}
                onChange={e => setFormData({ ...formData, shutter_speed: e.target.value })}
                placeholder="Shutter (e.g., 15s)"
                className="px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              />
              <input
                type="text"
                value={formData.aperture || ''}
                onChange={e => setFormData({ ...formData, aperture: e.target.value })}
                placeholder="Aperture (e.g., f/2.8)"
                className="px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              />
              <input
                type="text"
                value={formData.camera_model || ''}
                onChange={e => setFormData({ ...formData, camera_model: e.target.value })}
                placeholder="Camera Model"
                className="px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Help others learn! Share your settings so they can capture great aurora photos too.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-xl hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span> Uploading...
              </span>
            ) : (
              '🚀 Upload Photo'
            )}
          </button>

          {/* Tips */}
          <div className="bg-aurora-green/10 border border-aurora-green/30 rounded-lg p-4">
            <h4 className="font-bold text-white mb-2">📝 Photo Tips</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Include foreground elements for depth</li>
              <li>• Keep ISO under 6400 to reduce noise</li>
              <li>• Use 15-30 second exposures</li>
              <li>• Manual focus set to infinity</li>
              <li>• Turn off image stabilization</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
