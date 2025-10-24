'use client';

import { useState, useEffect } from 'react';
import { AIScoreBreakdown } from '@/types/aurora-enhancements.types';
import { AuroraPhoto } from '@/types/aurora.types';

interface Props {
  photo: AuroraPhoto;
  onClose?: () => void;
}

export default function AIPhotoScoring({ photo, onClose }: Props) {
  const [scoreBreakdown, setScoreBreakdown] = useState<AIScoreBreakdown | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    analyzePhoto();
  }, [photo.id]);

  const analyzePhoto = async () => {
    setAnalyzing(true);
    try {
      // TODO: Replace with actual AI analysis API call
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI analysis results
      const mockBreakdown: AIScoreBreakdown = {
        overall: photo.quality_score ? photo.quality_score / 10 : 0.87,
        composition: {
          score: 0.92,
          feedback: [
            'Excellent use of rule of thirds',
            'Strong foreground interest with landscape elements',
            'Good balance between sky and ground',
            'Aurora positioned well in upper third',
          ],
        },
        color: {
          score: 0.85,
          feedback: [
            'Vibrant green aurora with good saturation',
            'Natural color temperature maintained',
            'Good contrast between aurora and night sky',
            'Could benefit from slight purple enhancement',
          ],
        },
        technical: {
          score: 0.84,
          feedback: [
            'Sharp focus throughout frame',
            'Minimal noise for high ISO',
            'Good exposure - no clipping in highlights',
            'Slight motion blur in aurora (consider faster shutter)',
          ],
        },
        suggestions: [
          'Try a slightly wider aperture (f/1.8 vs f/2.8) for more light',
          'Consider lowering ISO to 2000 to reduce noise',
          'Include more foreground elements for depth',
          'Experiment with vertical composition',
          'Post-process to enhance purple/pink aurora colors',
        ],
      };

      setScoreBreakdown(mockBreakdown);
    } catch (error) {
      console.error('Error analyzing photo:', error);
    }
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-aurora-green';
    if (score >= 0.75) return 'text-aurora-blue';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.75) return 'Good';
    if (score >= 0.6) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className={onClose ? "fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto" : ""}>
      <div className={`${onClose ? 'bg-dark-900 rounded-2xl max-w-4xl w-full border-2 border-aurora-purple/50 max-h-[90vh] overflow-y-auto' : 'w-full'}`}>
        {/* Header */}
        <div className={`${onClose ? 'sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10' : 'mb-6'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-pink bg-clip-text text-transparent mb-2">
                🤖 AI Quality Analysis
              </h2>
              <p className="text-gray-400">
                Detailed breakdown of your photo's composition, color, and technical quality
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className={onClose ? "p-6" : ""}>
          {analyzing ? (
            /* Analyzing State */
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">Analyzing Photo...</h3>
              <p className="text-gray-400">Our AI is evaluating composition, color, and technical quality</p>
              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-dark-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple h-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          ) : scoreBreakdown ? (
            /* Results */
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-aurora-purple/20 to-aurora-pink/20 border-2 border-aurora-purple/50 rounded-xl p-8 text-center">
                <div className="text-sm text-gray-400 mb-2">Overall Quality Score</div>
                <div className={`text-7xl font-bold mb-2 ${getScoreColor(scoreBreakdown.overall)}`}>
                  {(scoreBreakdown.overall * 100).toFixed(0)}
                </div>
                <div className="text-2xl font-bold text-white">{getScoreLabel(scoreBreakdown.overall)}</div>
              </div>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Composition */}
                <div className="bg-dark-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📐</span>
                      <h3 className="text-xl font-bold text-white">Composition</h3>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(scoreBreakdown.composition.score)}`}>
                      {(scoreBreakdown.composition.score * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-3 mb-3">
                    <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-green to-aurora-blue rounded-full transition-all"
                        style={{ width: `${scoreBreakdown.composition.score * 100}%` }}
                      />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {scoreBreakdown.composition.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-aurora-green mt-0.5">✓</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Color */}
                <div className="bg-dark-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎨</span>
                      <h3 className="text-xl font-bold text-white">Color</h3>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(scoreBreakdown.color.score)}`}>
                      {(scoreBreakdown.color.score * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-3 mb-3">
                    <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-blue to-aurora-purple rounded-full transition-all"
                        style={{ width: `${scoreBreakdown.color.score * 100}%` }}
                      />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {scoreBreakdown.color.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-aurora-blue mt-0.5">✓</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical */}
                <div className="bg-dark-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚙️</span>
                      <h3 className="text-xl font-bold text-white">Technical</h3>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(scoreBreakdown.technical.score)}`}>
                      {(scoreBreakdown.technical.score * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-3 mb-3">
                    <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-purple to-aurora-pink rounded-full transition-all"
                        style={{ width: `${scoreBreakdown.technical.score * 100}%` }}
                      />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {scoreBreakdown.technical.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-aurora-purple mt-0.5">✓</span>
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border border-aurora-green/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">💡</span>
                  <h3 className="text-xl font-bold text-white">Suggestions for Improvement</h3>
                </div>
                <ul className="space-y-3">
                  {scoreBreakdown.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-aurora-green font-bold">{index + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Photo Metadata */}
              {(photo.camera_model || photo.iso || photo.shutter_speed) && (
                <div className="bg-dark-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">📷 Camera Settings Used</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {photo.camera_model && (
                      <div>
                        <div className="text-sm text-gray-400">Camera</div>
                        <div className="font-semibold text-white">{photo.camera_model}</div>
                      </div>
                    )}
                    {photo.iso && (
                      <div>
                        <div className="text-sm text-gray-400">ISO</div>
                        <div className="font-semibold text-white">{photo.iso}</div>
                      </div>
                    )}
                    {photo.shutter_speed && (
                      <div>
                        <div className="text-sm text-gray-400">Shutter</div>
                        <div className="font-semibold text-white">{photo.shutter_speed}</div>
                      </div>
                    )}
                    {photo.aperture && (
                      <div>
                        <div className="text-sm text-gray-400">Aperture</div>
                        <div className="font-semibold text-white">{photo.aperture}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-bold rounded-xl hover:shadow-glow transition-all"
                >
                  Close Analysis
                </button>
              )}
            </div>
          ) : (
            /* Error State */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Failed</h3>
              <p className="text-gray-400 mb-6">We couldn't analyze this photo. Please try again.</p>
              <button
                onClick={analyzePhoto}
                className="px-6 py-3 bg-aurora-purple text-white font-bold rounded-lg hover:bg-aurora-purple/90 transition-colors"
              >
                Retry Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
