
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { JournalEntry } from "@/types/journal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [showPrompts, setShowPrompts] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async (append = true) => {
    setIsLoading(true);
    try {
      if (!append) {
        setOffset(0);
      }

      const { data: entriesData, error, count } = await supabase
        .from("entries")
        .select("*", { count: 'exact' })
        .order("timestamp", { ascending: false })
        .range(offset, offset + LIMIT - 1);

      if (error) throw error;

      const newEntries = entriesData || [];
      setEntries(append ? [...entries, ...newEntries] : newEntries);
      setHasMore(count > offset + LIMIT);
      setOffset(prev => append ? prev + LIMIT : LIMIT);
    } catch (error) {
      console.error("Error loading entries:", error);
      const storedEntries = await AsyncStorage.getItem("journal_entries");
      setEntries(storedEntries ? JSON.parse(storedEntries) : []);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodMap = {
      "😊 Happy": "😊",
      "😌 Calm": "😌",
      "😰 Anxious": "😰",
      "😢 Sad": "😢",
      "😠 Angry": "😠"
    };
    return moodMap[mood] || "😐";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Your Journal</ThemedText>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPrompts(!showPrompts)}
          >
            <ThemedText style={styles.toggleButtonText}>
              {showPrompts ? "Hide Prompts" : "Show Prompts"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            {showPrompts && (
              <View style={styles.promptContainer}>
                <ThemedText style={styles.promptText}>
                  {entry.content.split('\n\n')[0]}
                </ThemedText>
              </View>
            )}
            <ThemedText style={styles.entryText}>
              {entry.content.split('\n\n').slice(1).join('\n\n')}
            </ThemedText>
            <View style={styles.entryFooter}>
              <ThemedText style={styles.moodText}>
                {getMoodEmoji(entry.mood)}
              </ThemedText>
              <ThemedText style={styles.dateText}>
                {formatDate(entry.timestamp)}
              </ThemedText>
            </View>
          </View>
        ))}
        
        {hasMore && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={() => loadEntries(true)}
            disabled={isLoading}
          >
            <ThemedText style={styles.loadMoreText}>
              {isLoading ? "Loading..." : "Load More"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
  },
  toggleButton: {
    backgroundColor: Theme.colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Theme.shadows.soft,
  },
  promptContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  promptText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.textLight,
    fontStyle: 'italic',
  },
  entryText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.text,
    lineHeight: 24,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  moodText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.textLight,
  },
  loadMoreButton: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 16,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});
