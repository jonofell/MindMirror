
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '@/types/journal';

const OFFLINE_ENTRIES_KEY = 'offline_journal_entries';

export const saveOfflineEntry = async (entry: JournalEntry) => {
  try {
    const existingEntries = await AsyncStorage.getItem(OFFLINE_ENTRIES_KEY);
    const entries = existingEntries ? JSON.parse(existingEntries) : [];
    entries.push(entry);
    await AsyncStorage.setItem(OFFLINE_ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving offline entry:', error);
  }
};

export const syncOfflineEntries = async () => {
  try {
    const offlineEntries = await AsyncStorage.getItem(OFFLINE_ENTRIES_KEY);
    if (offlineEntries) {
      const entries = JSON.parse(offlineEntries);
      // Sync with Supabase here
      for (const entry of entries) {
        try {
          await createEntry(entry.content, entry.mood, entry.reflection);
        } catch (error) {
          console.error('Error syncing entry:', error);
          return false;
        }
      }
      await AsyncStorage.removeItem(OFFLINE_ENTRIES_KEY);
      return true;
    }
    return true;
  } catch (error) {
    console.error('Error syncing offline entries:', error);
    return false;
  }
};
