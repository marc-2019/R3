import { createWSClient } from './wsClient';

export type DataUpdateType = 'health' | 'backup' | 'system' | 'alert';

export interface DataUpdate {
  type: DataUpdateType;
  timestamp: string;
  data: any;
}

export const dataWebSocket = createWSClient<DataUpdate>('/api/ws/data');

export const subscribeToDataUpdates = (
  callback: (update: DataUpdate) => void,
  types: DataUpdateType[] = ['health', 'backup', 'system', 'alert']
) => {
  const subscription = dataWebSocket.subscribe((update) => {
    if (types.includes(update.type)) {
      callback(update);
    }
  });

  return () => subscription.unsubscribe();
};
