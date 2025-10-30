'use client';

import { useState, useEffect } from 'react';
import { AuroraEvent, AuroraPhoto, KPIndexData, getKPLevelInfo } from '@/types/aurora.types';
import { AuroraMosaic } from '@/types/aurora.types';
import LivePhotoFeed from '@/components/aurora/LivePhotoFeed';
import PhotoUploadModal from '@/components/aurora/PhotoUploadModal';
import MosaicGenerator from '@/components/aurora/MosaicGenerator';
import KPIndexDisplay from '@/components/aurora/KPIndexDisplay';
import EventStats from '@/components/aurora/EventStats';
import WebSocketProvider from '@/components/aurora/WebSocketProvider';
import PushNotificationManager from '@/components/aurora/PushNotificationManager';
import ChallengeLeaderboard from '@/components/aurora/ChallengeLeaderboard';
import BadgeDisplay from '@/components/aurora/BadgeDisplay';
import ForecastDisplay from '@/components/aurora/ForecastDisplay';
import EmailDigestSettings from '@/components/aurora/EmailDigestSettings';
import ARCameraOverlay from '@/components/aurora/ARCameraOverlay';
import AIPhotoScoring from '@/components/aurora/AIPhotoScoring';
import PrintDownload from '@/components/aurora/PrintDownload';
import Link from 'next/link';

function AuroraLivePage() {
  const [activeEvent, setActiveEvent] = useState<AuroraEvent | null>(null);
  const [livePhotos, setLivePhotos] = useState<AuroraPhoto[]>([]);
  const [currentKP, setCurrentKP] = useState<KPIndexData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMosaicGenerator, setShowMosaicGenerator] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Enhancement modals
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showARCamera, setShowARCamera] = useState(false);
  const [selectedPhotoForAI, setSelectedPhotoForAI] = useState<AuroraPhoto | null>(null);
  const [selectedMosaicForPrint, setSelectedMosaicForPrint] = useState<AuroraMosaic | null>(null);

  // Mock user ID (replace with actual auth)
  const userId = 'user-mock-123';

  // Fetch active event and setup real-time polling
  useEffect(() => {
    fetchActiveEvent();
    fetchCurrentKP();
    fetchLivePhotos();

    // Poll for updates every 10 seconds when page is active
    const interval = setInterval(() => {
      fetchActiveEvent();
      fetchCurrentKP();
      fetchLivePhotos();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchActiveEvent = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data } = await supabase
      //   .from('aurora_events')
      //   .select('*')
      //   .eq('status', 'active')
      //   .single();

      // Mock active event
      const mockEvent: AuroraEvent = {
        id: '1',
        event_date: new Date().toISOString().split('T')[0],
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        end_time: null,
        kp_index: 7.2,
        kp_max: 7.2,
        visibility_score: 9,
        cloud_coverage: 15,
        status: 'active',
        auto_generated: true,
        photo_count: 24,
        participant_count: 18,
        mosaic_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setActiveEvent(mockEvent);
      setIsLive(true);
    } catch (error) {
      console.error('Error fetching active event:', error);
      setIsLive(false);
    }
  };

  const fetchCurrentKP = async () => {
    try {
      // TODO: Replace with actual API call
      const mockKP: KPIndexData = {
        id: '1',
        kp_index: 7.2,
        timestamp: new Date().toISOString(),
        source: 'NOAA',
        forecast: false,
        aurora_probability: 98,
        created_at: new Date().toISOString(),
      };

      setCurrentKP(mockKP);
    } catch (error) {
      console.error('Error fetching KP index:', error);
    }
  };

  const fetchLivePhotos = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // Mock photos
      const mockPhotos: AuroraPhoto[] = Array.from({ length: 8 }, (_, i) => ({
        id: `photo-${i}`,
        event_id: '1',
        user_id: `user-${i}`,
        photo_url: `/placeholder-aurora-${i % 3}.jpg`,
        thumbnail_url: null,
        caption:
          i % 3 === 0
            ? 'Amazing display over Frame Lake!'
            : i % 3 === 1
              ? 'The colors are incredible tonight 💚'
              : null,
        location_lat: 62.454 + (Math.random() - 0.5) * 0.1,
        location_lng: -114.3718 + (Math.random() - 0.5) * 0.1,
        location_name: ['Frame Lake', 'Ingraham Trail Km 5', 'Yellowknife Bay', 'Old Town'][i % 4],
        camera_model: 'iPhone 14 Pro',
        iso: 3200,
        shutter_speed: '15s',
        aperture: 'f/1.8',
        focal_length: '24mm',
        taken_at: new Date(Date.now() - i * 5 * 60 * 1000).toISOString(),
        uploaded_at: new Date(Date.now() - i * 4 * 60 * 1000).toISOString(),
        likes_count: Math.floor(Math.random() * 50),
        featured: i < 3,
        quality_score: 7 + Math.floor(Math.random() * 3),
        approved: true,
        flagged: false,
        created_at: new Date().toISOString(),
        photographer_name: ['Sarah', 'Mike', 'Emma', 'John', 'Lisa'][i % 5],
      }));

      setLivePhotos(mockPhotos);
    } catch (error) {
      console.error('Error fetching live photos:', error);
    }
  };

  const handlePhotoUploaded = (photo: AuroraPhoto) => {
    setLivePhotos(prev => [photo, ...prev]);
    if (activeEvent) {
      setActiveEvent({
        ...activeEvent,
        photo_count: activeEvent.photo_count + 1,
      });
    }
  };

  const kpInfo = currentKP ? getKPLevelInfo(currentKP.kp_index) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-900 to-black">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple animate-aurora bg-[length:200%_100%]"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <Link
            href="/aurora"
            className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-6"
          >
            ← Back to Aurora Hub
          </Link>

          {/* Live Indicator */}
          {isLive && (
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-red-400 font-bold uppercase text-sm tracking-wider">
                Live Aurora Event
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
              Aurora Live
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-6">
            Real-time community aurora tracking. Upload your photos, join the live event, and watch
            as we create a stunning mosaic of tonight's display!
          </p>

          {/* KP Index Display */}
          {currentKP && kpInfo && (
            <div className="inline-block">
              <div
                className="bg-dark-800/80 backdrop-blur-lg border-2 rounded-xl p-6"
                style={{ borderColor: kpInfo.color }}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Current KP Index</div>
                    <div className="text-5xl font-bold" style={{ color: kpInfo.color }}>
                      {currentKP.kp_index.toFixed(1)}
                    </div>
                  </div>
                  <div className="border-l border-gray-700 pl-4">
                    <div className="text-lg font-bold text-white">{kpInfo.label}</div>
                    <div className="text-sm text-gray-400">{kpInfo.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {currentKP.aurora_probability}% probability
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {activeEvent ? (
          <>
            {/* Event Stats Bar */}
            <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 border border-aurora-green/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-aurora-green">
                    {activeEvent.photo_count}
                  </div>
                  <div className="text-sm text-gray-400">Photos Uploaded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-aurora-blue">
                    {activeEvent.participant_count}
                  </div>
                  <div className="text-sm text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-aurora-purple">
                    {Math.floor((Date.now() - new Date(activeEvent.start_time).getTime()) / 60000)}m
                  </div>
                  <div className="text-sm text-gray-400">Event Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {activeEvent.visibility_score}/10
                  </div>
                  <div className="text-sm text-gray-400">Visibility Score</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-xl hover:shadow-aurora transition-all"
              >
                📸 Upload Photo
              </button>
              <button
                onClick={() => setShowMosaicGenerator(true)}
                className="px-6 py-3 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-bold rounded-xl hover:shadow-glow transition-all"
              >
                🎨 Create Mosaic
              </button>
              <button
                onClick={() => setShowARCamera(true)}
                className="px-6 py-3 bg-gradient-to-r from-aurora-blue to-aurora-purple text-white font-bold rounded-xl hover:shadow-glow transition-all"
              >
                📷 AR Camera
              </button>
              <button
                onClick={() => setShowChallenges(true)}
                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-all border-2 border-aurora-purple/30"
              >
                🏆 Challenges
              </button>
              <button
                onClick={() => setShowForecast(true)}
                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-all border-2 border-aurora-green/30"
              >
                🔮 Forecast
              </button>
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-xl transition-all border-2 border-gray-600"
              >
                🔔 Alerts
              </button>
            </div>

            {/* Live Photo Feed */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Live Photo Feed
                  <span className="ml-3 text-sm text-gray-400">Updates every 10s</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Auto-refreshing
                </div>
              </div>
              <LivePhotoFeed photos={livePhotos} eventId={activeEvent.id} />
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
              <PhotoUploadModal
                eventId={activeEvent.id}
                onClose={() => setShowUploadModal(false)}
                onPhotoUploaded={handlePhotoUploaded}
              />
            )}

            {/* Mosaic Generator Modal */}
            {showMosaicGenerator && (
              <MosaicGenerator
                eventId={activeEvent.id}
                photos={livePhotos}
                onClose={() => setShowMosaicGenerator(false)}
              />
            )}
          </>
        ) : (
          /* No Active Event */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🌙</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Active Aurora Event</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              When the KP index reaches 4.0 or higher, a live event will automatically start and
              you'll be able to upload photos and join the community!
            </p>

            {currentKP && (
              <div className="inline-block bg-dark-800 rounded-xl p-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Current KP Index</div>
                <div className="text-4xl font-bold text-gray-300">
                  {currentKP.kp_index.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 mt-2">Event starts at KP ≥ 4.0</div>
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/aurora"
                className="inline-block px-6 py-3 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-colors font-medium"
              >
                View Aurora Forecast
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-12 border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-3">🤳</div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Live</h3>
            <p className="text-gray-400 text-sm">
              Share your aurora photos in real-time during active events. Get instant feedback from
              the community!
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-xl font-bold text-white mb-2">Create Mosaics</h3>
            <p className="text-gray-400 text-sm">
              Generate beautiful mosaics from photos taken at the same moment. See the aurora from
              every angle!
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Join Community</h3>
            <p className="text-gray-400 text-sm">
              Connect with fellow aurora chasers, share tips, and celebrate amazing captures
              together!
            </p>
          </div>
        </div>
      </div>

      {/* Enhancement Modals */}
      {showNotificationSettings && (
        <PushNotificationManager
          userId={userId}
          onClose={() => setShowNotificationSettings(false)}
        />
      )}

      {showChallenges && (
        <ChallengeLeaderboard userId={userId} onClose={() => setShowChallenges(false)} />
      )}

      {showForecast && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 rounded-2xl max-w-5xl w-full border-2 border-aurora-green/50 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white">🔮 Aurora Forecast</h2>
              <button
                onClick={() => setShowForecast(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <ForecastDisplay />
          </div>
        </div>
      )}

      {showEmailSettings && (
        <EmailDigestSettings userId={userId} onClose={() => setShowEmailSettings(false)} />
      )}

      {showBadges && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 rounded-2xl max-w-5xl w-full border-2 border-aurora-purple/50 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white">🏅 Badges & Stats</h2>
              <button
                onClick={() => setShowBadges(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <BadgeDisplay userId={userId} />
          </div>
        </div>
      )}

      {showARCamera && currentKP && (
        <ARCameraOverlay currentKP={currentKP.kp_index} onClose={() => setShowARCamera(false)} />
      )}

      {selectedPhotoForAI && (
        <AIPhotoScoring photo={selectedPhotoForAI} onClose={() => setSelectedPhotoForAI(null)} />
      )}

      {selectedMosaicForPrint && (
        <PrintDownload
          mosaic={selectedMosaicForPrint}
          onClose={() => setSelectedMosaicForPrint(null)}
        />
      )}
    </div>
  );
}

// Wrap the page with WebSocketProvider for real-time updates
function AuroraLivePageWithWebSocket() {
  return (
    <WebSocketProvider>
      <AuroraLivePage />
    </WebSocketProvider>
  );
}

export default AuroraLivePageWithWebSocket;
