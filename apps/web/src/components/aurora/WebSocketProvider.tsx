'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { WebSocketMessage } from '@/types/aurora-enhancements.types';
import { AuroraPhoto, AuroraEvent } from '@/types/aurora.types';

interface WebSocketContextType {
  connected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  subscribe: (eventId: string) => void;
  unsubscribe: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  lastMessage: null,
  sendMessage: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

interface Props {
  children: ReactNode;
  eventId?: string;
  onPhotoUploaded?: (photo: AuroraPhoto) => void;
  onPhotoLiked?: (photoId: string, likesCount: number) => void;
  onKPUpdated?: (kp: number) => void;
  onEventUpdate?: (event: AuroraEvent) => void;
  onMosaicCreated?: (mosaicId: string) => void;
}

export default function WebSocketProvider({
  children,
  eventId,
  onPhotoUploaded,
  onPhotoLiked,
  onKPUpdated,
  onEventUpdate,
  onMosaicCreated,
}: Props) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (connected && eventId) {
      subscribe(eventId);
    }
  }, [connected, eventId]);

  const connect = () => {
    try {
      // TODO: Replace with actual WebSocket URL
      // const websocket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

      // For now, simulate WebSocket connection
      console.log('WebSocket: Simulating connection...');
      setConnected(true);
      setReconnectAttempts(0);

      // Simulate incoming messages for development
      if (process.env.NODE_ENV === 'development') {
        simulateMessages();
      }

      /* Real WebSocket implementation:
      websocket.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setReconnectAttempts(0);
      };

      websocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        setWs(null);

        // Attempt reconnection
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        }
      };

      setWs(websocket);
      */
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    setLastMessage(message);

    switch (message.type) {
      case 'photo_uploaded':
        if (onPhotoUploaded && message.data.photo) {
          onPhotoUploaded(message.data.photo);
        }
        break;

      case 'photo_liked':
        if (onPhotoLiked) {
          onPhotoLiked(message.data.photoId, message.data.likesCount);
        }
        break;

      case 'kp_updated':
        if (onKPUpdated) {
          onKPUpdated(message.data.kp);
        }
        break;

      case 'event_started':
      case 'event_ended':
        if (onEventUpdate && message.data.event) {
          onEventUpdate(message.data.event);
        }
        break;

      case 'mosaic_created':
        if (onMosaicCreated) {
          onMosaicCreated(message.data.mosaicId);
        }
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Message not sent:', message);
    }
  };

  const subscribe = (targetEventId: string) => {
    sendMessage({
      type: 'subscribe',
      event_id: targetEventId,
    });
    console.log('Subscribed to event:', targetEventId);
  };

  const unsubscribe = () => {
    sendMessage({
      type: 'unsubscribe',
    });
    console.log('Unsubscribed from events');
  };

  // Simulate messages for development
  const simulateMessages = () => {
    const messageTypes: WebSocketMessage['type'][] = [
      'photo_uploaded',
      'photo_liked',
      'kp_updated',
    ];

    const interval = setInterval(() => {
      if (!connected) {
        clearInterval(interval);
        return;
      }

      const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      let mockMessage: WebSocketMessage;

      switch (randomType) {
        case 'photo_uploaded':
          mockMessage = {
            type: 'photo_uploaded',
            event_id: eventId,
            data: {
              photo: {
                id: crypto.randomUUID(),
                event_id: eventId || '',
                user_id: 'user-sim',
                photo_url: '/mock-photo.jpg',
                caption: 'Amazing aurora captured just now!',
                photographer_name: ['Alex', 'Sarah', 'Mike', 'Emma'][Math.floor(Math.random() * 4)],
                likes_count: 0,
                uploaded_at: new Date().toISOString(),
              },
            },
            timestamp: new Date().toISOString(),
          };
          break;

        case 'photo_liked':
          mockMessage = {
            type: 'photo_liked',
            event_id: eventId,
            data: {
              photoId: 'photo-' + Math.floor(Math.random() * 100),
              likesCount: Math.floor(Math.random() * 50) + 1,
            },
            timestamp: new Date().toISOString(),
          };
          break;

        case 'kp_updated':
          mockMessage = {
            type: 'kp_updated',
            data: {
              kp: 5.0 + Math.random() * 3,
            },
            timestamp: new Date().toISOString(),
          };
          break;

        default:
          return;
      }

      handleMessage(mockMessage);
    }, 15000); // Simulate message every 15 seconds
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage,
        sendMessage,
        subscribe,
        unsubscribe,
      }}
    >
      {children}

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            connected
              ? 'bg-aurora-green/20 text-aurora-green border border-aurora-green/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-aurora-green' : 'bg-red-500'
              }`}
            />
            <span>{connected ? 'Live' : reconnectAttempts > 0 ? 'Reconnecting...' : 'Offline'}</span>
          </div>
        </div>
      </div>
    </WebSocketContext.Provider>
  );
}
