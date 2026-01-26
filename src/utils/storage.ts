import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
    id: string;
    type: string;
    data: string;
    timestamp: number;
}

const HISTORY_KEY = '@qr_history';
const MAX_HISTORY = 100;

export const Storage = {
    getHistory: async (): Promise<HistoryItem[]> => {
        try {
            const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error('Failed to load history', e);
            return [];
        }
    },

    saveScan: async (data: string, type: string) => {
        try {
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                type,
                data,
                timestamp: Date.now(),
            };

            const currentHistory = await Storage.getHistory();

            // Avoid duplicates at the top of the list
            if (currentHistory.length > 0 && currentHistory[0].data === data) {
                return;
            }

            const newHistory = [newItem, ...currentHistory].slice(0, MAX_HISTORY);

            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        } catch (e) {
            console.error('Failed to save scan', e);
        }
    },

    clearHistory: async () => {
        try {
            await AsyncStorage.removeItem(HISTORY_KEY);
        } catch (e) {
            console.error('Failed to clear history', e);
        }
    },

    deleteItem: async (id: string) => {
        try {
            const currentHistory = await Storage.getHistory();
            const newHistory = currentHistory.filter(item => item.id !== id);
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        } catch (e) {
            console.error('Failed to delete item', e);
        }
    }
};
