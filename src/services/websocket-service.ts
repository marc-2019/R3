// src/services/websocket-service.ts

import { createWSClient } from './wsClient';

export type DataUpdateType = 'health' | 'backup' | 'system' | 'alert';

interface DataUpdate {
  type: DataUpdateType;
  data: any;
}

class WebSocketService {
  private client;
  private subscribers: Map<DataUpdateType, Set<(data: any) => void>> = new Map();

  constructor() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';
    this.client = createWSClient({
      url: wsUrl,
      reconnectInterval: 5000,
      maxReconnectAttempts: 5
    });

    this.client.subscribe(this.handleMessage.bind(this));
  }

  private handleMessage(message: DataUpdate) {
    const subscribers = this.subscribers.get(message.type);
    if (subscribers) {
      subscribers.forEach(callback => callback(message.data));
    }
  }

  subscribe(type: DataUpdateType, callback: (data: any) => void) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);

    return () => {
      this.subscribers.get(type)?.delete(callback);
    };
  }

  send(type: DataUpdateType, data: any) {
    return this.client.send({ type, data });
  }

  connect() {
    this.client.connect();
  }

  close() {
    this.client.close();
  }
}

export const websocketService = new WebSocketService();