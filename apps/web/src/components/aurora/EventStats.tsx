'use client';

import { AuroraEvent } from '@/types/aurora.types';

interface Props {
  event: AuroraEvent;
}

export default function EventStats({ event }: Props) {
  const eventDuration = Math.floor((Date.now() - new Date(event.start_time).getTime()) / 60000);

  return (
    <div className="bg-dark-800/50 backdrop-blur-lg rounded-xl p-6 border border-aurora-green/20">
      <h3 className="text-xl font-bold text-white mb-4">Event Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Photo Count */}
        <div className="text-center">
          <div className="text-4xl font-bold text-aurora-green mb-1">
            {event.photo_count}
          </div>
          <div className="text-sm text-gray-400">Photos</div>
        </div>

        {/* Participants */}
        <div className="text-center">
          <div className="text-4xl font-bold text-aurora-blue mb-1">
            {event.participant_count}
          </div>
          <div className="text-sm text-gray-400">Participants</div>
        </div>

        {/* Duration */}
        <div className="text-center">
          <div className="text-4xl font-bold text-aurora-purple mb-1">
            {eventDuration}m
          </div>
          <div className="text-sm text-gray-400">Duration</div>
        </div>

        {/* Visibility */}
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-1">
            {event.visibility_score}/10
          </div>
          <div className="text-sm text-gray-400">Visibility</div>
        </div>
      </div>
    </div>
  );
}
