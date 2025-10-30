'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  LogbookFormData,
  LogbookFormErrors,
  EXPERIENCE_TYPES,
  EXPERIENCE_TYPE_CONFIG,
  ExperienceType,
  VISIT_DURATIONS,
  RATING_LABELS,
} from '@/types/visitor-logbook.types';

interface AddLogbookEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddLogbookEntryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddLogbookEntryModalProps) {
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState<LogbookFormData>({
    visitor_name: '',
    visitor_location: '',
    title: '',
    message: '',
    visit_date: new Date().toISOString().split('T')[0],
    visit_duration: '',
    experience_type: [],
    rating: 5,
    photos: [],
    uploadedPhotoUrls: [],
  });

  const [errors, setErrors] = useState<LogbookFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pre-fill name from profile
  useEffect(() => {
    if (profile?.full_name) {
      setFormData(prev => ({ ...prev, visitor_name: profile.full_name || '' }));
    }
  }, [profile]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: LogbookFormErrors = {};

    if (!formData.visitor_name.trim() || formData.visitor_name.length < 2) {
      newErrors.visitor_name = 'Please enter your name (at least 2 characters)';
    }

    if (!formData.visitor_location.trim() || formData.visitor_location.length < 2) {
      newErrors.visitor_location = "Please enter where you're from";
    }

    if (!formData.title.trim() || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Please share more about your experience (at least 10 characters)';
    }

    if (formData.message.length > 2000) {
      newErrors.message = 'Message is too long (max 2000 characters)';
    }

    if (!formData.visit_date) {
      newErrors.visit_date = 'Please select your visit date';
    }

    if (formData.experience_type.length === 0) {
      newErrors.experience_type = 'Please select at least one experience type';
    }

    if (formData.uploadedPhotoUrls.length === 0 && formData.photos.length === 0) {
      newErrors.photos = 'Please upload at least one photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle photo selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate total photos
    const totalPhotos = formData.uploadedPhotoUrls.length + files.length;
    if (totalPhotos > 10) {
      setErrors({ ...errors, photos: 'Maximum 10 photos allowed' });
      return;
    }

    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photos: 'Only image files are allowed' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, photos: 'Each photo must be under 10MB' });
        return;
      }
    }

    setFormData({ ...formData, photos: [...formData.photos, ...files] });
    setErrors({ ...errors, photos: undefined });

    // Auto-upload photos
    await uploadPhotos(files);
  };

  // Upload photos to server
  const uploadPhotos = async (files: File[]) => {
    setUploadingPhotos(true);

    try {
      const uploadPromises = files.map(async file => {
        const formDataToSend = new FormData();
        formDataToSend.append('photo', file);

        const response = await fetch('/api/visitor-logbook/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to upload photo');
        }

        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData(prev => ({
        ...prev,
        uploadedPhotoUrls: [...prev.uploadedPhotoUrls, ...uploadedUrls],
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
      setErrors({
        ...errors,
        photos: error instanceof Error ? error.message : 'Failed to upload photos',
      });
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      uploadedPhotoUrls: formData.uploadedPhotoUrls.filter((_, i) => i !== index),
    });
  };

  // Toggle experience type
  const toggleExperienceType = (type: ExperienceType) => {
    const current = formData.experience_type;
    const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];

    setFormData({ ...formData, experience_type: updated });
    setErrors({ ...errors, experience_type: undefined });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to share your experience');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const entryData = {
        visitor_name: formData.visitor_name.trim(),
        visitor_location: formData.visitor_location.trim(),
        title: formData.title.trim(),
        message: formData.message.trim(),
        visit_date: formData.visit_date,
        visit_duration: formData.visit_duration || undefined,
        experience_type: formData.experience_type,
        rating: formData.rating,
        photos: formData.uploadedPhotoUrls,
      };

      const response = await fetch('/api/visitor-logbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create entry');
      }

      setSubmitSuccess(true);

      // Wait a moment before closing
      setTimeout(() => {
        onSuccess?.();
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Error submitting entry:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to submit your entry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      visitor_name: profile?.full_name || '',
      visitor_location: '',
      title: '',
      message: '',
      visit_date: new Date().toISOString().split('T')[0],
      visit_duration: '',
      experience_type: [],
      rating: 5,
      photos: [],
      uploadedPhotoUrls: [],
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ✨ Share Your Yellowknife Experience
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
            <p className="font-semibold">Success! Your entry has been submitted.</p>
            <p className="text-sm mt-1">It will appear on the website once approved by our team.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.visitor_name}
                onChange={e => setFormData({ ...formData, visitor_name: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent"
                placeholder="John Doe"
              />
              {errors.visitor_name && (
                <p className="mt-1 text-sm text-red-400">{errors.visitor_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Where Are You From? *
              </label>
              <input
                type="text"
                value={formData.visitor_location}
                onChange={e => setFormData({ ...formData, visitor_location: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent"
                placeholder="Toronto, ON"
              />
              {errors.visitor_location && (
                <p className="mt-1 text-sm text-red-400">{errors.visitor_location}</p>
              )}
            </div>
          </div>

          {/* Visit Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Visit Date *</label>
              <input
                type="date"
                value={formData.visit_date}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({ ...formData, visit_date: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent"
              />
              {errors.visit_date && (
                <p className="mt-1 text-sm text-red-400">{errors.visit_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How Long Did You Stay?
              </label>
              <select
                value={formData.visit_duration}
                onChange={e => setFormData({ ...formData, visit_duration: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent"
              >
                <option value="">Select duration...</option>
                {VISIT_DURATIONS.map(duration => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title of Your Experience *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent"
              placeholder="Amazing Northern Lights Adventure!"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
              <p className="text-sm text-gray-400 ml-auto">{formData.title.length}/100</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Share Your Experience *
            </label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-green focus:border-transparent resize-none"
              placeholder="Tell us about your visit to Yellowknife! What did you love? What made it memorable?"
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              {errors.message && <p className="text-sm text-red-400">{errors.message}</p>}
              <p className="text-sm text-gray-400 ml-auto">{formData.message.length}/2000</p>
            </div>
          </div>

          {/* Experience Types */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              What Did You Experience? * (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {EXPERIENCE_TYPES.map(type => {
                const config = EXPERIENCE_TYPE_CONFIG[type];
                const isSelected = formData.experience_type.includes(type);

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleExperienceType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-aurora-green text-white shadow-lg scale-105'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-gray-600'
                    }`}
                  >
                    <span className="mr-1">{config.icon}</span>
                    {config.label}
                  </button>
                );
              })}
            </div>
            {errors.experience_type && (
              <p className="mt-2 text-sm text-red-400">{errors.experience_type}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Overall Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="group transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 transition-colors ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-600 group-hover:text-gray-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-gray-300 font-medium">
                {RATING_LABELS[formData.rating as keyof typeof RATING_LABELS]}
              </span>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Upload Photos * (Up to 10 photos, 10MB each)
            </label>

            {/* Photo Upload Area */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                disabled={uploadingPhotos || formData.uploadedPhotoUrls.length >= 10}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  uploadingPhotos || formData.uploadedPhotoUrls.length >= 10
                    ? 'border-gray-700 bg-dark-900 cursor-not-allowed'
                    : 'border-gray-600 bg-dark-700 hover:border-aurora-green hover:bg-dark-600'
                }`}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-white font-medium mb-1">
                  {uploadingPhotos ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-400">JPG, PNG, WEBP, or HEIC (max 10MB each)</p>
              </label>
            </div>

            {/* Photo Previews */}
            {formData.uploadedPhotoUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.uploadedPhotoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-aurora-green text-white text-xs px-2 py-0.5 rounded">
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.photos && <p className="mt-2 text-sm text-red-400">{errors.photos}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploadingPhotos}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Share My Experience'}
            </button>
          </div>

          <p className="text-sm text-gray-400 text-center">
            Your entry will be reviewed before appearing on the website.
          </p>
        </form>
      </div>
    </div>
  );
}
