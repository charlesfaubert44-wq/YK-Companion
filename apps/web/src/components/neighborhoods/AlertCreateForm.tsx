'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AlertCreateForm - Create new neighborhood safety alerts
 *
 * Features:
 * - Alert type selection
 * - Severity levels
 * - Location picker
 * - Photo upload
 * - Real-time preview
 */

interface AlertFormData {
  type: 'crime' | 'suspicious' | 'lost_pet' | 'found_item' | 'emergency' | 'power_outage' | 'road_closure' | '';
  severity: 'low' | 'medium' | 'high' | 'urgent' | '';
  title: string;
  description: string;
  locationAddress: string;
  locationDescription: string;
  photos: File[];
}

const ALERT_TYPES = [
  { value: 'crime', label: 'Crime Report', icon: '🚨', color: 'from-red-500 to-orange-500' },
  { value: 'suspicious', label: 'Suspicious Activity', icon: '👀', color: 'from-yellow-500 to-orange-500' },
  { value: 'lost_pet', label: 'Lost Pet', icon: '🐕', color: 'from-blue-500 to-cyan-500' },
  { value: 'found_item', label: 'Found Item', icon: '🔍', color: 'from-green-500 to-emerald-500' },
  { value: 'emergency', label: 'Emergency', icon: '⚠️', color: 'from-red-600 to-red-500' },
  { value: 'power_outage', label: 'Power Outage', icon: '💡', color: 'from-purple-500 to-pink-500' },
  { value: 'road_closure', label: 'Road Closure', icon: '🚧', color: 'from-orange-500 to-yellow-500' },
];

export default function AlertCreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AlertFormData>({
    type: '',
    severity: '',
    title: '',
    description: '',
    locationAddress: '',
    locationDescription: '',
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<AlertFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      updateFormData({ photos: [...formData.photos, ...newPhotos].slice(0, 4) }); // Max 4 photos
    }
  };

  const removePhoto = (index: number) => {
    updateFormData({ photos: formData.photos.filter((_, i) => i !== index) });
  };

  const canSubmit = () => {
    return formData.type && formData.severity && formData.title && formData.description;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/neighborhoods/dashboard');
    }, 2000);
  };

  const selectedType = ALERT_TYPES.find(t => t.value === formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="text-6xl mb-4 animate-pulse">🚨</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Create Safety Alert
          </h1>
          <p className="text-xl text-gray-300">
            Notify your neighborhood about safety concerns or community updates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-3xl p-8 shadow-2xl">
              {/* Alert Type */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-4">
                  Alert Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALERT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateFormData({ type: type.value as any })}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.type === type.value
                          ? 'border-aurora-blue bg-aurora-blue/10'
                          : 'border-gray-700 bg-dark-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-xl opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative text-center">
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold text-white">{type.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-4">
                  Severity <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'low', label: 'Low', color: 'bg-green-500', desc: 'FYI' },
                    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', desc: 'Be aware' },
                    { value: 'high', label: 'High', color: 'bg-orange-500', desc: 'Take action' },
                    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', desc: 'Immediate' },
                  ].map((severity) => (
                    <button
                      key={severity.value}
                      type="button"
                      onClick={() => updateFormData({ severity: severity.value as any })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.severity === severity.value
                          ? `${severity.color} border-white text-white`
                          : 'border-gray-700 bg-dark-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-bold">{severity.label}</div>
                      <div className="text-xs opacity-80">{severity.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Alert Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g., Bear spotted near Range Lake Park"
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors"
                  maxLength={100}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.title.length}/100
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Provide details about the situation, what happened, when, and any other relevant information..."
                  rows={5}
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.description.length}/500
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.locationAddress}
                  onChange={(e) => updateFormData({ locationAddress: e.target.value })}
                  placeholder="Address or intersection"
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors mb-3"
                />
                <input
                  type="text"
                  value={formData.locationDescription}
                  onChange={(e) => updateFormData({ locationDescription: e.target.value })}
                  placeholder="e.g., Near the tennis courts"
                  className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors"
                />
              </div>

              {/* Photos */}
              <div className="mb-6">
                <label className="block text-lg font-semibold text-white mb-2">
                  Photos (optional, max 4)
                </label>

                {formData.photos.length < 4 && (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors bg-dark-800/30">
                      <div className="text-5xl mb-3">📷</div>
                      <p className="text-white font-semibold mb-1">Click to upload photos</p>
                      <p className="text-gray-400 text-sm">JPG, PNG up to 5MB each</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-dark-800 rounded-xl overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🖼️
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                        <div className="text-xs text-gray-400 mt-1 truncate">{photo.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Important Notice */}
              {formData.type === 'crime' && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="text-white font-semibold mb-1">Important</div>
                      <p className="text-sm text-gray-300">
                        For active emergencies, please call RCMP (867-669-1111) first before posting here.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="w-full group relative px-8 py-4 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-aurora hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting Alert...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Post Alert</span>
                    <span className="transition-transform group-hover:translate-x-2">→</span>
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-purple/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👁️</span>
                <span>Preview</span>
              </h3>

              {selectedType && formData.title ? (
                <div className="bg-dark-800/50 border-2 border-gray-700 rounded-xl p-4">
                  {/* Alert Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{selectedType.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm">{formData.title || 'Alert title...'}</h4>
                        {formData.severity && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            formData.severity === 'urgent' ? 'bg-red-500 text-white' :
                            formData.severity === 'high' ? 'bg-orange-500 text-white' :
                            formData.severity === 'medium' ? 'bg-yellow-500 text-black' :
                            'bg-green-500 text-white'
                          }`}>
                            {formData.severity.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {formData.description || 'Alert description...'}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {formData.locationAddress && (
                    <div className="text-xs text-gray-400 mb-2">
                      📍 {formData.locationAddress}
                    </div>
                  )}

                  {/* Photos Preview */}
                  {formData.photos.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {formData.photos.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-12 h-12 bg-dark-700 rounded text-xl flex items-center justify-center">
                          📷
                        </div>
                      ))}
                      {formData.photos.length > 3 && (
                        <div className="w-12 h-12 bg-dark-700 rounded text-xs flex items-center justify-center text-gray-400">
                          +{formData.photos.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                    <span>Just now</span>
                    <span>👁️ 0 views</span>
                  </div>
                </div>
              ) : (
                <div className="bg-dark-800/50 rounded-xl p-8 text-center">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-gray-400 text-sm">
                    Fill out the form to see a preview
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="mt-6 bg-aurora-blue/10 border border-aurora-blue/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-2">💡 Tips</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Be specific and factual</li>
                  <li>• Include time and location</li>
                  <li>• Add photos if available</li>
                  <li>• Mark severity appropriately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
