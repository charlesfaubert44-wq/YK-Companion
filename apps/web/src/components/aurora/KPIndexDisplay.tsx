'use client';

import { KPIndexData, getKPLevelInfo } from '@/types/aurora.types';

interface Props {
  kpData: KPIndexData;
  showDetails?: boolean;
}

export default function KPIndexDisplay({ kpData, showDetails = false }: Props) {
  const levelInfo = getKPLevelInfo(kpData.kp_index);

  return (
    <div
      className="bg-dark-800/80 backdrop-blur-lg border-2 rounded-xl p-6 transition-all hover:shadow-lg"
      style={{ borderColor: levelInfo.color }}
    >
      <div className="flex items-center gap-6">
        {/* KP Value */}
        <div>
          <div className="text-sm text-gray-400 mb-1">KP Index</div>
          <div className="text-6xl font-bold" style={{ color: levelInfo.color }}>
            {kpData.kp_index.toFixed(1)}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-20 bg-gray-700"></div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-white mb-1">{levelInfo.label}</div>
          <div className="text-gray-400 mb-2">{levelInfo.description}</div>

          {kpData.aurora_probability && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${kpData.aurora_probability}%`,
                    backgroundColor: levelInfo.color,
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold" style={{ color: levelInfo.color }}>
                {kpData.aurora_probability}%
              </span>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Source</div>
            <div className="text-white font-medium">{kpData.source}</div>
          </div>
          <div>
            <div className="text-gray-500">Updated</div>
            <div className="text-white font-medium">
              {new Date(kpData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
