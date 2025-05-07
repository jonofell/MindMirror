
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

  const groupEntriesByMonth = (entries: JournalEntry[]) => {
    const groups: { [key: string]: JournalEntry[] } = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp * 1000);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(entry);
    });
    
    return groups;
  };

  const entriesByMonth = groupEntriesByMonth(entries);

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {Object.entries(entriesByMonth).map(([month, entries]) => {
          const [year, monthNum] = month.split('-');
          const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long' });
          
          return (
            <View key={month} style={styles.monthGroup}>
              <ThemedText style={styles.monthHeader}>
                {`${monthName} ${year}`}
              </ThemedText>
              {entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <ThemedText style={styles.entryText}>{entry.content}</ThemedText>
                  <ThemedText style={styles.entryDate}>
                    {new Date(entry.timestamp * 1000).toLocaleDateString()}
                  </ThemedText>
                </View>
              ))}
            </View>
          );
        })}
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
  monthGroup: {
    marginBottom: 20,
  },
  monthHeader: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: Theme.colors.text,
    marginBottom: 10,
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  entryText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.text,
  },
  entryDate: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.textLight,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadMoreButton: {
    backgroundColor: Theme.colors.primary,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  loadMoreText: {
    color: 'white',
    fontSize: 16,
  },
});
