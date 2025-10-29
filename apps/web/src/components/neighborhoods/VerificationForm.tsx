'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * VerificationForm - Multi-step verification submission form
 *
 * Features:
 * - 3-step wizard interface
 * - Address validation
 * - Document upload
 * - Vouching alternative
 * - Privacy settings
 * - Beautiful animations
 */

interface VerificationData {
  // Step 1
  address: string;
  unitNumber: string;
  moveInDate: string;
  residencyType: 'homeowner' | 'renter' | '';
  landlordContact: string;

  // Step 2
  documentType: string;
  documentFile: File | null;
  additionalInfo: string;
  useVouching: boolean;

  // Step 3
  showInDirectory: boolean;
  shareAddress: boolean;
  receiveCrimeAlerts: boolean;
  receiveCommunityAlerts: boolean;
}

const INITIAL_DATA: VerificationData = {
  address: '',
  unitNumber: '',
  moveInDate: '',
  residencyType: '',
  landlordContact: '',
  documentType: '',
  documentFile: null,
  additionalInfo: '',
  useVouching: false,
  showInDirectory: true,
  shareAddress: false,
  receiveCrimeAlerts: true,
  receiveCommunityAlerts: true,
};

interface Props {
  neighborhoodName: string;
  neighborhoodIcon: string;
}

export default function VerificationForm({ neighborhoodName, neighborhoodIcon }: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VerificationData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 3;

  const updateFormData = (updates: Partial<VerificationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileChange = (file: File | null) => {
    updateFormData({ documentFile: file });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const canProceedToStep2 = () => {
    return formData.address && formData.moveInDate && formData.residencyType;
  };

  const canProceedToStep3 = () => {
    return formData.useVouching || (formData.documentType && formData.documentFile);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/neighborhoods/verification-pending');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="text-6xl mb-4 animate-bounce-slow">{neighborhoodIcon}</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Verify Your Residence
          </h1>
          <p className="text-xl text-gray-300">
            Join verified neighbors in <span className="text-aurora-blue font-semibold">{neighborhoodName}</span>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step circle */}
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    step < currentStep
                      ? 'bg-aurora-green text-white shadow-aurora'
                      : step === currentStep
                      ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora animate-pulse'
                      : 'bg-dark-800 text-gray-500 border-2 border-gray-700'
                  }`}>
                    {step < currentStep ? '✓' : step}
                    {step === currentStep && (
                      <div className="absolute inset-0 rounded-full bg-aurora-blue blur-lg opacity-50 animate-pulse"></div>
                    )}
                  </div>

                  {/* Step label */}
                  <div className={`mt-2 text-sm font-medium transition-colors ${
                    step === currentStep ? 'text-aurora-blue' : step < currentStep ? 'text-aurora-green' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Address'}
                    {step === 2 && 'Verification'}
                    {step === 3 && 'Privacy'}
                  </div>
                </div>

                {/* Connector line */}
                {step < totalSteps && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${
                    step < currentStep ? 'bg-aurora-green' : 'bg-dark-800'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple rounded-3xl blur-2xl opacity-20"></div>

          <div className="relative bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-3xl p-8 shadow-2xl">
            {/* Step 1: Address Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-3xl">📍</span>
                    <span>Your Address</span>
                  </h2>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData({ address: e.target.value })}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Unit Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Unit/Apt (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.unitNumber}
                    onChange={(e) => updateFormData({ unitNumber: e.target.value })}
                    placeholder="Unit 4B"
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Move-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    When did you move in? <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="month"
                    value={formData.moveInDate}
                    onChange={(e) => updateFormData({ moveInDate: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white focus:border-aurora-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Residency Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    I am a: <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateFormData({ residencyType: 'homeowner' })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.residencyType === 'homeowner'
                          ? 'border-aurora-green bg-aurora-green/10 text-white'
                          : 'border-gray-700 bg-dark-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">🏠</div>
                      <div className="font-semibold">Homeowner</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData({ residencyType: 'renter' })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.residencyType === 'renter'
                          ? 'border-aurora-blue bg-aurora-blue/10 text-white'
                          : 'border-gray-700 bg-dark-800/50 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">🔑</div>
                      <div className="font-semibold">Renter</div>
                    </button>
                  </div>
                </div>

                {/* Landlord Contact (conditional) */}
                {formData.residencyType === 'renter' && (
                  <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Landlord/Property Manager Contact (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landlordContact}
                      onChange={(e) => updateFormData({ landlordContact: e.target.value })}
                      placeholder="For verification if needed"
                      className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-3xl">📄</span>
                    <span>Proof of Residence</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Upload a document showing your name and address, or request vouching from neighbors
                  </p>
                </div>

                {/* Vouching Option */}
                <div className="bg-aurora-purple/10 border-2 border-aurora-purple/30 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="useVouching"
                      checked={formData.useVouching}
                      onChange={(e) => updateFormData({ useVouching: e.target.checked, documentType: '', documentFile: null })}
                      className="mt-1 w-5 h-5 rounded border-2 border-aurora-purple bg-dark-800 checked:bg-aurora-purple focus:ring-2 focus:ring-aurora-purple focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <label htmlFor="useVouching" className="text-white font-semibold cursor-pointer">
                        Request vouching from 2 verified neighbors instead
                      </label>
                      <p className="text-gray-400 text-sm mt-1">
                        Don't have documents handy? Get vouched by neighbors who can confirm you live here.
                      </p>
                    </div>
                  </div>
                </div>

                {!formData.useVouching && (
                  <>
                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Document Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.documentType}
                        onChange={(e) => updateFormData({ documentType: e.target.value })}
                        className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white focus:border-aurora-blue focus:outline-none transition-colors"
                      >
                        <option value="">Select a document type</option>
                        <option value="utility_bill">Utility Bill (Power, Water, Internet)</option>
                        <option value="lease">Lease Agreement</option>
                        <option value="drivers_license">Driver's License</option>
                        <option value="property_tax">Property Tax Notice</option>
                        <option value="government_mail">Government Mail</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Upload Document <span className="text-red-400">*</span>
                      </label>
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                          dragActive
                            ? 'border-aurora-blue bg-aurora-blue/10'
                            : 'border-gray-700 bg-dark-800/30 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {formData.documentFile ? (
                            <div className="animate-in zoom-in duration-300">
                              <div className="text-5xl mb-3">✓</div>
                              <p className="text-aurora-green font-semibold mb-1">
                                {formData.documentFile.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {(formData.documentFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleFileChange(null);
                                }}
                                className="mt-3 text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove file
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="text-5xl mb-3">📎</div>
                              <p className="text-white font-semibold mb-1">
                                Drop file here or click to browse
                              </p>
                              <p className="text-gray-400 text-sm">
                                PDF, JPG, PNG up to 10MB
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Information (optional)
                      </label>
                      <textarea
                        value={formData.additionalInfo}
                        onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
                        placeholder="Any additional context that might help with verification..."
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-aurora-blue focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </>
                )}

                {formData.useVouching && (
                  <div className="bg-dark-800/50 rounded-xl p-6 border-2 border-gray-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>🤝</span>
                      <span>How Vouching Works</span>
                    </h3>
                    <ol className="space-y-2 text-gray-300 text-sm">
                      <li className="flex gap-3">
                        <span className="text-aurora-blue font-bold">1.</span>
                        <span>After submission, you'll receive a shareable link</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-aurora-blue font-bold">2.</span>
                        <span>Share the link with 2 verified neighbors</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-aurora-blue font-bold">3.</span>
                        <span>They confirm you live in the neighborhood</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-aurora-blue font-bold">4.</span>
                        <span>Admin reviews and approves your request</span>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Privacy Settings */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="text-3xl">🔒</span>
                    <span>Privacy Settings</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Control what information you share with verified neighbors
                  </p>
                </div>

                {/* Privacy Options */}
                <div className="space-y-4">
                  {[
                    {
                      key: 'showInDirectory',
                      icon: '📖',
                      label: 'Show me in neighborhood directory',
                      description: 'Other verified neighbors can see your name and profile',
                    },
                    {
                      key: 'shareAddress',
                      icon: '📍',
                      label: 'Share my full address with neighbors',
                      description: 'If disabled, only your street name will be visible',
                    },
                    {
                      key: 'receiveCrimeAlerts',
                      icon: '🚨',
                      label: 'Receive crime watch alerts via email',
                      description: 'Get notified about safety concerns in your area',
                    },
                    {
                      key: 'receiveCommunityAlerts',
                      icon: '💬',
                      label: 'Receive community updates',
                      description: 'Events, announcements, and community news',
                    },
                  ].map((option) => (
                    <div key={option.key} className="bg-dark-800/50 border-2 border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id={option.key}
                          checked={formData[option.key as keyof VerificationData] as boolean}
                          onChange={(e) => updateFormData({ [option.key]: e.target.checked })}
                          className="mt-1 w-5 h-5 rounded border-2 border-gray-600 bg-dark-800 checked:bg-aurora-blue focus:ring-2 focus:ring-aurora-blue focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <label htmlFor={option.key} className="text-white font-semibold cursor-pointer flex items-center gap-2">
                            <span className="text-xl">{option.icon}</span>
                            <span>{option.label}</span>
                          </label>
                          <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agreement */}
                <div className="bg-aurora-blue/10 border-2 border-aurora-blue/30 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-3">By submitting, you agree to:</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex gap-2">
                      <span className="text-aurora-blue">•</span>
                      <span>Provide accurate information about your residency</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-aurora-blue">•</span>
                      <span>Follow the neighborhood community guidelines</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-aurora-blue">•</span>
                      <span>Respect other members' privacy</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-aurora-blue">•</span>
                      <span>Use the platform for community building only</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
              {/* Back Button */}
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'bg-dark-800 text-gray-600 cursor-not-allowed'
                    : 'bg-dark-800 text-white hover:bg-dark-700'
                }`}
              >
                ← Back
              </button>

              {/* Next/Submit Button */}
              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={
                    (currentStep === 1 && !canProceedToStep2()) ||
                    (currentStep === 2 && !canProceedToStep3())
                  }
                  className={`group relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    ((currentStep === 1 && !canProceedToStep2()) || (currentStep === 2 && !canProceedToStep3()))
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white hover:shadow-aurora hover:scale-105'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>Continue</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative px-8 py-3 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-aurora hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Submit for Review</span>
                      <span className="text-xl">✓</span>
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-aurora-purple via-aurora-pink to-aurora-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
