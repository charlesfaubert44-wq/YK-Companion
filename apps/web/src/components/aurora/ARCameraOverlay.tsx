'use client';

import { useState, useEffect } from 'react';
import {
  ARCameraRecommendation,
  ARCameraSettings,
  SkillLevel,
} from '@/types/aurora-enhancements.types';

interface Props {
  currentKP: number;
  onClose?: () => void;
}

export default function ARCameraOverlay({ currentKP, onClose }: Props) {
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [recommendation, setRecommendation] = useState<ARCameraRecommendation | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    fetchRecommendation();
  }, [currentKP]);

  const fetchRecommendation = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('ar_camera_recommendations')
      //   .select('*')
      //   .lte('kp_index', currentKP)
      //   .order('kp_index', { ascending: false })
      //   .limit(1)
      //   .single();

      // Mock recommendation based on KP
      const getBrightnessLevel = (kp: number): 'dim' | 'moderate' | 'bright' => {
        if (kp >= 7) return 'bright';
        if (kp >= 5) return 'moderate';
        return 'dim';
      };

      const mockRecommendation: ARCameraRecommendation = {
        id: '1',
        kp_index: currentKP,
        brightness_level: getBrightnessLevel(currentKP),
        beginner_settings: {
          iso: currentKP >= 7 ? 800 : currentKP >= 5 ? 1600 : 3200,
          shutter_speed: currentKP >= 7 ? '8s' : currentKP >= 5 ? '15s' : '20s',
          aperture: 'f/1.8',
          white_balance: '3200K',
          tips: [
            'Use a tripod or stable surface',
            'Turn off image stabilization',
            'Use a timer to avoid camera shake',
            'Focus manually on a distant light',
          ],
        },
        intermediate_settings: {
          iso: currentKP >= 7 ? 640 : currentKP >= 5 ? 1250 : 2500,
          shutter_speed: currentKP >= 7 ? '6s' : currentKP >= 5 ? '10s' : '15s',
          aperture: 'f/2.8',
          white_balance: '3200K',
          tips: [
            'Shoot in RAW for better post-processing',
            'Use exposure bracketing',
            'Include foreground elements for scale',
            'Check histogram to avoid overexposure',
          ],
        },
        advanced_settings: {
          iso: currentKP >= 7 ? 400 : currentKP >= 5 ? 800 : 1600,
          shutter_speed: currentKP >= 7 ? '4s' : currentKP >= 5 ? '8s' : '12s',
          aperture: 'f/2.0',
          white_balance: 'Custom 3200K',
          tips: [
            'Use intervalometer for time-lapse',
            'Capture multiple exposures for stacking',
            'Manual focus at infinity with fine adjustment',
            'Shoot wider and crop for sharpness',
          ],
        },
        phone_model_overrides: {
          'iPhone 14 Pro': {
            iso: 1600,
            shutter_speed: '10s',
            tips: ['Use Night mode', 'Enable ProRAW'],
          },
          'iPhone 15 Pro': {
            iso: 1250,
            shutter_speed: '10s',
            tips: ['Use Night mode', 'Enable ProRAW', 'Use 48MP mode'],
          },
          'Samsung Galaxy S23': {
            iso: 1600,
            shutter_speed: '10s',
            tips: ['Use Pro mode', 'Enable RAW', 'Turn on Expert RAW'],
          },
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setRecommendation(mockRecommendation);
    } catch (error) {
      console.error('Error fetching camera recommendation:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      // In real implementation, attach stream to video element
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const currentSettings = recommendation ? recommendation[`${skillLevel}_settings`] : null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera View (placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-b from-northern-midnight via-dark-900 to-black flex items-center justify-center">
        {cameraActive ? (
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📷</div>
            <p>Camera feed would appear here</p>
            <p className="text-sm mt-2">In production, this would show live camera view</p>
          </div>
        ) : (
          <button
            onClick={startCamera}
            className="px-8 py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-xl text-lg hover:shadow-aurora transition-all"
          >
            📸 Start Camera
          </button>
        )}
      </div>

      {/* Settings Overlay */}
      {showOverlay && currentSettings && recommendation && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6">
          {/* Skill Level Selector */}
          <div className="mb-4 flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map(level => (
              <button
                key={level}
                onClick={() => setSkillLevel(level)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
                  skillLevel === level
                    ? 'bg-aurora-purple text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* KP Index Display */}
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-dark-900 rounded-lg px-4 py-2 border-2 border-aurora-green/30">
              <span className="text-sm text-gray-400 mr-2">Current KP:</span>
              <span className="text-xl font-bold text-aurora-green">{currentKP.toFixed(1)}</span>
            </div>
            <div className="bg-dark-900 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-400 mr-2">Brightness:</span>
              <span className="text-sm font-bold text-white capitalize">
                {recommendation.brightness_level}
              </span>
            </div>
          </div>

          {/* Camera Settings Grid */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-dark-900/90 backdrop-blur rounded-lg p-3 border-2 border-aurora-blue/30">
              <div className="text-xs text-gray-400 mb-1">ISO</div>
              <div className="text-2xl font-bold text-aurora-blue">{currentSettings.iso}</div>
            </div>
            <div className="bg-dark-900/90 backdrop-blur rounded-lg p-3 border-2 border-aurora-green/30">
              <div className="text-xs text-gray-400 mb-1">Shutter</div>
              <div className="text-2xl font-bold text-aurora-green">
                {currentSettings.shutter_speed}
              </div>
            </div>
            <div className="bg-dark-900/90 backdrop-blur rounded-lg p-3 border-2 border-aurora-purple/30">
              <div className="text-xs text-gray-400 mb-1">Aperture</div>
              <div className="text-2xl font-bold text-aurora-purple">
                {currentSettings.aperture}
              </div>
            </div>
            <div className="bg-dark-900/90 backdrop-blur rounded-lg p-3 border-2 border-yellow-400/30">
              <div className="text-xs text-gray-400 mb-1">WB</div>
              <div className="text-xl font-bold text-yellow-400">
                {currentSettings.white_balance}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-dark-900/90 backdrop-blur rounded-lg p-4 mb-4">
            <div className="text-sm font-bold text-white mb-2">💡 Tips for {skillLevel}s:</div>
            <ul className="text-sm text-gray-300 space-y-1">
              {currentSettings.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-aurora-green mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowOverlay(false)}
              className="px-6 py-3 bg-dark-800 text-white hover:bg-dark-700 rounded-lg font-bold transition-colors"
            >
              Hide Overlay
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-lg hover:shadow-aurora transition-all">
              📸 Capture Photo
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show Overlay Button (when hidden) */}
      {!showOverlay && (
        <button
          onClick={() => setShowOverlay(true)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-dark-900/90 backdrop-blur text-white rounded-full font-bold hover:bg-dark-800 transition-colors"
        >
          📊 Show Settings
        </button>
      )}
    </div>
  );
}
