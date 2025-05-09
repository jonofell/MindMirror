import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { JournalEntry } from "@/types/journal";
import { supabase } from "@/lib/supabase";
import { LinearGradient } from "expo-linear-gradient";

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.mood?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const LIMIT = 20; // Number of entries to load per request

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async (append = true) => {
    setIsLoading(true);
    try {
      if (!append) {
        setOffset(0);
      }

      const { data: { user } } = await supabase.auth.getUser();
      const {
        data: entriesData,
        error,
        count,
      } = await supabase
        .from("entries")
        .select("*", { count: "exact" })
        .eq('user_id', user?.id)
        .order("timestamp", { ascending: false })
        .range(offset, offset + LIMIT - 1);

      if (error) throw error;

      const newEntries = entriesData || [];
      setEntries(append ? [...entries, ...newEntries] : newEntries);
      setHasMore(count > offset + LIMIT);
      setOffset((prev) => (append ? prev + LIMIT : LIMIT));
    } catch (error) {
      console.error("Error loading entries:", error);
      // Load from local storage as fallback
      const storedEntries = await AsyncStorage.getItem("journal_entries");
      setEntries(storedEntries ? JSON.parse(storedEntries) : []);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search entries..."
          placeholderTextColor={Theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {filteredEntries?.length > 0 ? (
          filteredEntries.map((entry) => (
            <View key={entry.id} style={styles.entryCard}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={async () => {
                    try {
                      // Delete from Supabase
                      await supabase.from('entries').delete().eq('id', entry.id);

                      // Delete from local storage
                      const storedEntries = await AsyncStorage.getItem('journal_entries');
                      if (storedEntries) {
                        const parsedEntries = JSON.parse(storedEntries);
                        const updatedEntries = parsedEntries.filter(e => e.id !== entry.id);
                        await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
                      }

                      // Update state
                      setEntries(entries.filter(e => e.id !== entry.id));
                    } catch (error) {
                      console.error('Error deleting entry:', error);
                    }
                  }}
                >
                  <ThemedText style={styles.deleteButtonText}>×</ThemedText>
                </TouchableOpacity>
              <View style={styles.entryHeader}>
                <View style={styles.dateContainer}>
                  <ThemedText style={styles.entryDay}>
                    {new Date(entry.timestamp * 1000).toLocaleDateString(
                      "en-US",
                      { weekday: "long" },
                    )}
                  </ThemedText>
                  <ThemedText style={styles.entryDate}>
                    {new Date(entry.timestamp * 1000).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </ThemedText>
                </View>
                {entry.mood && (
                  <View style={styles.moodContainer}>
                    <ThemedText style={styles.moodEmoji}>
                      {entry.mood.split(" ")[0]}
                    </ThemedText>
                    <ThemedText style={styles.moodText}>
                      {entry.mood.split(" ")[1]}
                    </ThemedText>
                  </View>
                )}
              </View>
              {entry.content.split("\n\n").map((section, index) => {
                const parts = section.split("\n");
                const prompt = parts[0];
                const response = parts.slice(1).join("\n");

                return (
                  <View key={index}>
                    {!isCollapsed && (
                      <ThemedText style={styles.promptText}>
                        {prompt}
                      </ThemedText>
                    )}
                    {response && (
                      <ThemedText
                        style={[
                          styles.entryContent,
                          prompt.startsWith("It sounds like") &&
                            styles.suggestionText,
                        ]}
                      >
                        {response}
                      </ThemedText>
                    )}
                  </View>
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              No journal entries yet
            </ThemedText>
          </View>
        )}
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
  searchContainer: {
    padding: 16,
    paddingTop: 60,
  },
  searchInput: {
    backgroundColor: Theme.colors.card,
    padding: 12,
    borderRadius: 8,
    color: Theme.colors.text,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  entryDay: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#666",
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.textLight,
  },
  moodContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Theme.colors.cardLight,
    borderRadius: 12,
    padding: 8,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    color: Theme.colors.primary,
    textTransform: "capitalize",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: Theme.colors.primary,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  promptText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#FA8072",
    marginTop: 8,
    marginBottom: 4,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row", // Added for delete button layout
    alignItems: "center", // Added for delete button layout
  },
  entryContent: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.text,
    marginBottom: 16,
  },
  suggestionText: {
    color: Theme.colors.text,
    fontStyle: "normal",
    marginTop: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.textLight,
  },
  loadMoreButton: {
    backgroundColor: Theme.colors.primary,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  loadMoreText: {
    color: "white",
    fontSize: 16,
  },
  deleteButton: {
    marginRight: 10, // Added for spacing
  },
  deleteButtonText: {
    fontSize: 20,
    color: "red",
  },
});