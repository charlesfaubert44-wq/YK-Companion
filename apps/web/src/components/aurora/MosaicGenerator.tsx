'use client';

import { useState } from 'react';
import { AuroraPhoto, AuroraMosaic, MOSAIC_GRID_SIZES } from '@/types/aurora.types';

interface Props {
  eventId: string;
  photos: AuroraPhoto[];
  onClose: () => void;
}

export default function MosaicGenerator({ eventId, photos, onClose }: Props) {
  const [selectedGridSize, setSelectedGridSize] = useState('4x4');
  const [timeWindow, setTimeWindow] = useState(30); // minutes
  const [selectedPhotos, setSelectedPhotos] = useState<AuroraPhoto[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedMosaic, setGeneratedMosaic] = useState<AuroraMosaic | null>(null);

  const gridConfig = MOSAIC_GRID_SIZES.find(g => g.value === selectedGridSize)!;

  const generateMosaic = async () => {
    setGenerating(true);

    // Simulate mosaic generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Auto-select best photos if none selected
    const photosToUse =
      selectedPhotos.length > 0
        ? selectedPhotos
        : photos
            .sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0))
            .slice(0, gridConfig.photos);

    const mosaic: AuroraMosaic = {
      id: crypto.randomUUID(),
      event_id: eventId,
      title: `Aurora Mosaic - ${new Date().toLocaleTimeString()}`,
      description: `A beautiful collection of ${photosToUse.length} aurora photos from tonight's event`,
      mosaic_url: '/generated-mosaic.jpg', // This would be generated server-side
      thumbnail_url: null,
      photo_ids: photosToUse.map(p => p.id),
      grid_size: selectedGridSize,
      total_photos: photosToUse.length,
      time_window_start: new Date(Date.now() - timeWindow * 60 * 1000).toISOString(),
      time_window_end: new Date().toISOString(),
      moment_description: `Peak aurora activity at ${new Date().toLocaleTimeString()}`,
      views_count: 0,
      shares_count: 0,
      generated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      photos: photosToUse,
    };

    setGeneratedMosaic(mosaic);
    setGenerating(false);
  };

  const togglePhotoSelection = (photo: AuroraPhoto) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.some(p => p.id === photo.id);
      if (isSelected) {
        return prev.filter(p => p.id !== photo.id);
      } else if (prev.length < gridConfig.photos) {
        return [...prev, photo];
      }
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-dark-900 rounded-2xl max-w-6xl w-full border-2 border-aurora-purple/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-purple to-aurora-pink bg-clip-text text-transparent mb-2">
                🎨 Create Aurora Mosaic
              </h2>
              <p className="text-gray-400">
                Combine multiple photos into a stunning mosaic showcasing tonight's aurora from
                different perspectives
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

        <div className="p-6">
          {!generatedMosaic ? (
            <>
              {/* Configuration */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Grid Size */}
                <div>
                  <label className="block text-white font-semibold mb-3">Mosaic Grid Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOSAIC_GRID_SIZES.map(size => (
                      <button
                        key={size.value}
                        onClick={() => setSelectedGridSize(size.value)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedGridSize === size.value
                            ? 'border-aurora-purple bg-aurora-purple/20 text-white'
                            : 'border-gray-700 bg-dark-800 text-gray-400 hover:border-aurora-purple/50'
                        }`}
                      >
                        <div className="font-bold">{size.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Window */}
                <div>
                  <label className="block text-white font-semibold mb-3">Time Window</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 30, 60].map(minutes => (
                      <button
                        key={minutes}
                        onClick={() => setTimeWindow(minutes)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          timeWindow === minutes
                            ? 'border-aurora-blue bg-aurora-blue/20 text-white'
                            : 'border-gray-700 bg-dark-800 text-gray-400 hover:border-aurora-blue/50'
                        }`}
                      >
                        <div className="font-bold">{minutes}min</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Photos from the last {timeWindow} minutes
                  </p>
                </div>
              </div>

              {/* Photo Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Select Photos ({selectedPhotos.length}/{gridConfig.photos})
                  </h3>
                  <button
                    onClick={() => setSelectedPhotos([])}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>

                <div className="bg-aurora-purple/10 border border-aurora-purple/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300">
                    💡 <strong>Tip:</strong> Leave empty to auto-select the best {gridConfig.photos}{' '}
                    photos based on quality scores. Or manually select your favorites!
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {photos.slice(0, 20).map(photo => {
                    const isSelected = selectedPhotos.some(p => p.id === photo.id);
                    const canSelect = selectedPhotos.length < gridConfig.photos;

                    return (
                      <button
                        key={photo.id}
                        onClick={() => togglePhotoSelection(photo)}
                        disabled={!canSelect && !isSelected}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-aurora-purple shadow-lg scale-95'
                            : canSelect
                              ? 'border-gray-700 hover:border-aurora-purple/50'
                              : 'border-gray-800 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {/* Placeholder for actual photo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/20 to-aurora-purple/20 flex items-center justify-center">
                          <span className="text-4xl">🌌</span>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-8 h-8 bg-aurora-purple rounded-full flex items-center justify-center text-white font-bold">
                            {selectedPhotos.findIndex(p => p.id === photo.id) + 1}
                          </div>
                        )}

                        {/* Photo Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <div className="text-xs text-white">{photo.photographer_name}</div>
                          <div className="text-xs text-gray-400">⭐ {photo.likes_count}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateMosaic}
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-aurora-purple to-aurora-pink text-white font-bold rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span> Generating Mosaic...
                  </span>
                ) : (
                  '✨ Generate Mosaic'
                )}
              </button>
            </>
          ) : (
            /* Generated Mosaic Preview */
            <div>
              <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 rounded-xl p-8 mb-6 border border-aurora-purple/30">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🎉</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Mosaic Generated!</h3>
                    <p className="text-gray-400">Your aurora mosaic is ready</p>
                  </div>
                </div>

                {/* Mosaic Grid Preview */}
                <div className="bg-dark-900 rounded-lg p-6 mb-6">
                  <div
                    className={`grid gap-2`}
                    style={{
                      gridTemplateColumns: `repeat(${selectedGridSize.split('x')[0]}, 1fr)`,
                    }}
                  >
                    {generatedMosaic.photos?.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded bg-gradient-to-br from-aurora-green/20 to-aurora-purple/20 flex items-center justify-center text-2xl"
                      >
                        🌌
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mosaic Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-dark-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-aurora-purple">
                      {generatedMosaic.total_photos}
                    </div>
                    <div className="text-sm text-gray-400">Photos</div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-aurora-blue">
                      {generatedMosaic.grid_size}
                    </div>
                    <div className="text-sm text-gray-400">Grid Size</div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-aurora-green">{timeWindow}min</div>
                    <div className="text-sm text-gray-400">Time Window</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-dark-900 rounded-lg p-4 mb-6">
                  <p className="text-gray-300">{generatedMosaic.moment_description}</p>
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-3 gap-3">
                  <button className="px-6 py-3 bg-aurora-green text-white font-bold rounded-lg hover:bg-aurora-green/90 transition-colors">
                    💾 Save Mosaic
                  </button>
                  <button className="px-6 py-3 bg-aurora-blue text-white font-bold rounded-lg hover:bg-aurora-blue/90 transition-colors">
                    📤 Share
                  </button>
                  <button className="px-6 py-3 bg-aurora-purple text-white font-bold rounded-lg hover:bg-aurora-purple/90 transition-colors">
                    🖼️ View Full Size
                  </button>
                </div>
              </div>

              {/* Create Another */}
              <button
                onClick={() => {
                  setGeneratedMosaic(null);
                  setSelectedPhotos([]);
                }}
                className="w-full py-3 bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors font-medium"
              >
                ← Create Another Mosaic
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
