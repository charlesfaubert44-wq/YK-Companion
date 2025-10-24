'use client';

import { useState } from 'react';
import { PrintOptions, PrintDownload as PrintDownloadType } from '@/types/aurora-enhancements.types';
import { AuroraMosaic } from '@/types/aurora.types';

interface Props {
  mosaic: AuroraMosaic;
  onClose: () => void;
}

export default function PrintDownload({ mosaic, onClose }: Props) {
  const [options, setOptions] = useState<PrintOptions>({
    resolution: '4K',
    dpi: 300,
    format: 'JPG',
    color_profile: 'sRGB',
    size: {
      width: 3840,
      height: 2160,
      unit: 'px',
    },
  });
  const [generating, setGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<PrintDownloadType | null>(null);

  const updateOptions = (updates: Partial<PrintOptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  };

  const updateResolution = (resolution: PrintOptions['resolution']) => {
    const dimensions = {
      '4K': { width: 3840, height: 2160 },
      '8K': { width: 7680, height: 4320 },
      '12K': { width: 11520, height: 6480 },
    };

    updateOptions({
      resolution,
      size: {
        ...options.size,
        ...dimensions[resolution],
      },
    });
  };

  const estimateFileSize = (): number => {
    const baseSize = options.size.width * options.size.height;
    const formatMultiplier = {
      JPG: 0.000003,
      PNG: 0.000008,
      TIFF: 0.000012,
    };
    const dpiMultiplier = options.dpi / 150;

    return Math.round(baseSize * formatMultiplier[options.format] * dpiMultiplier);
  };

  const getPrintSize = () => {
    const dpi = options.dpi;
    const widthInches = options.size.width / dpi;
    const heightInches = options.size.height / dpi;

    return {
      inches: `${widthInches.toFixed(1)}" × ${heightInches.toFixed(1)}"`,
      cm: `${(widthInches * 2.54).toFixed(1)}cm × ${(heightInches * 2.54).toFixed(1)}cm`,
    };
  };

  const generateDownload = async () => {
    setGenerating(true);

    try {
      // TODO: Replace with actual API call to generate high-res download
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockDownload: PrintDownloadType = {
        mosaic_id: mosaic.id,
        options,
        file_size_mb: estimateFileSize(),
        download_url: `/api/mosaics/${mosaic.id}/download?resolution=${options.resolution}&format=${options.format}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };

      setDownloadInfo(mockDownload);
      setDownloadReady(true);
    } catch (error) {
      console.error('Error generating download:', error);
      alert('Failed to generate download. Please try again.');
    }

    setGenerating(false);
  };

  const fileSize = estimateFileSize();
  const printSize = getPrintSize();

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-dark-900 rounded-2xl max-w-3xl w-full border-2 border-aurora-green/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900 border-b border-gray-800 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-aurora-green to-aurora-blue bg-clip-text text-transparent mb-2">
                🖼️ Print-Quality Download
              </h2>
              <p className="text-gray-400">
                Download high-resolution mosaic for printing or professional use
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

        <div className="p-6 space-y-6">
          {!downloadReady ? (
            <>
              {/* Resolution Selection */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">📐 Resolution</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['4K', '8K', '12K'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => updateResolution(res)}
                      className={`py-4 rounded-lg border-2 transition-all ${
                        options.resolution === res
                          ? 'bg-aurora-green border-aurora-green text-white'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-green/50'
                      }`}
                    >
                      <div className="font-bold text-xl">{res}</div>
                      <div className="text-xs">
                        {res === '4K' && '3840×2160'}
                        {res === '8K' && '7680×4320'}
                        {res === '12K' && '11520×6480'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* DPI Selection */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">📊 DPI (Print Quality)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[150, 300, 600].map((dpi) => (
                    <button
                      key={dpi}
                      onClick={() => updateOptions({ dpi: dpi as PrintOptions['dpi'] })}
                      className={`py-4 rounded-lg border-2 transition-all ${
                        options.dpi === dpi
                          ? 'bg-aurora-blue border-aurora-blue text-white'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-blue/50'
                      }`}
                    >
                      <div className="font-bold text-xl">{dpi} DPI</div>
                      <div className="text-xs">
                        {dpi === 150 && 'Web/Screen'}
                        {dpi === 300 && 'Standard Print'}
                        {dpi === 600 && 'Professional'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">💾 File Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['JPG', 'PNG', 'TIFF'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => updateOptions({ format })}
                      className={`py-4 rounded-lg border-2 transition-all ${
                        options.format === format
                          ? 'bg-aurora-purple border-aurora-purple text-white'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-aurora-purple/50'
                      }`}
                    >
                      <div className="font-bold text-xl">{format}</div>
                      <div className="text-xs">
                        {format === 'JPG' && 'Smaller size'}
                        {format === 'PNG' && 'Lossless'}
                        {format === 'TIFF' && 'Professional'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Profile */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">🎨 Color Profile</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['sRGB', 'AdobeRGB', 'ProPhoto'] as const).map((profile) => (
                    <button
                      key={profile}
                      onClick={() => updateOptions({ color_profile: profile })}
                      className={`py-4 rounded-lg border-2 transition-all ${
                        options.color_profile === profile
                          ? 'bg-yellow-500 border-yellow-500 text-black'
                          : 'bg-dark-800 border-gray-700 text-gray-400 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="font-bold text-lg">{profile}</div>
                      <div className="text-xs">
                        {profile === 'sRGB' && 'Standard'}
                        {profile === 'AdobeRGB' && 'Wide gamut'}
                        {profile === 'ProPhoto' && 'Maximum'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-aurora-green/10 to-aurora-blue/10 border border-aurora-green/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">📝 Download Summary</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-dark-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">File Size (estimated)</div>
                    <div className="text-2xl font-bold text-aurora-green">{fileSize} MB</div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Print Size @ {options.dpi} DPI</div>
                    <div className="text-xl font-bold text-aurora-blue">{printSize.inches}</div>
                    <div className="text-sm text-gray-400">{printSize.cm}</div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Resolution</div>
                    <div className="text-xl font-bold text-aurora-purple">
                      {options.size.width} × {options.size.height}
                    </div>
                  </div>
                  <div className="bg-dark-900 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Format & Profile</div>
                    <div className="text-xl font-bold text-yellow-400">
                      {options.format} • {options.color_profile}
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateDownload}
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-xl hover:shadow-aurora transition-all disabled:opacity-50 text-lg"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span> Generating High-Res Download...
                  </span>
                ) : (
                  '✨ Generate Download'
                )}
              </button>

              {/* Info */}
              <div className="bg-dark-800 rounded-lg p-4 text-sm text-gray-400">
                <strong className="text-white">Note:</strong> High-resolution downloads may take a few moments to generate.
                Download links expire after 24 hours. For commercial use, please review our licensing terms.
              </div>
            </>
          ) : (
            /* Download Ready */
            <div className="text-center py-8">
              <div className="text-7xl mb-6">✅</div>
              <h3 className="text-3xl font-bold text-white mb-4">Download Ready!</h3>
              <p className="text-gray-400 mb-6">
                Your high-resolution mosaic is ready to download
              </p>

              {downloadInfo && (
                <>
                  <div className="bg-dark-800 rounded-xl p-6 mb-6 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">File Size</div>
                        <div className="text-xl font-bold text-white">{downloadInfo.file_size_mb} MB</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Resolution</div>
                        <div className="text-xl font-bold text-white">{options.resolution}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Format</div>
                        <div className="text-xl font-bold text-white">{options.format}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Expires</div>
                        <div className="text-sm font-bold text-yellow-400">
                          {new Date(downloadInfo.expires_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={downloadInfo.download_url}
                    download
                    className="inline-block w-full py-4 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-xl hover:shadow-aurora transition-all text-lg mb-3"
                  >
                    💾 Download Now ({downloadInfo.file_size_mb} MB)
                  </a>
                </>
              )}

              <button
                onClick={() => {
                  setDownloadReady(false);
                  setDownloadInfo(null);
                }}
                className="w-full py-3 bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg font-bold transition-colors"
              >
                ← Generate Another Version
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
