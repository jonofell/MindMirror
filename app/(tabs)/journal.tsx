import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Collapsible } from "@/components/Collapsible";
import { JournalEntry } from "@/types/journal";
import { Theme } from "@/constants/Theme";
import { LinearGradient } from "expo-linear-gradient";

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: entries, error } = await supabase
        .from("entries")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;
      setEntries(entries || []);
    } catch (error) {
      console.error("Error loading entries:", error);
      // Load from local storage as fallback
      const storedEntries = await AsyncStorage.getItem("journal_entries");
      setEntries(storedEntries ? JSON.parse(storedEntries) : []);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title}>Journal Entries</ThemedText>
          <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
            <ThemedText style={styles.toggleButton}>
              {isCollapsed ? "Show prompts" : "Hide prompts"}
            </ThemedText>
          </TouchableOpacity>
        </View>
        {entries?.length > 0 ? entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.dateContainer}>
                <ThemedText style={styles.entryDay}>
                  {new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long' })}
                </ThemedText>
                <ThemedText style={styles.entryDate}>
                  {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </ThemedText>
              </View>
              {entry.mood && (
                <View style={styles.moodContainer}>
                  <ThemedText style={styles.moodEmoji}>
                    {entry.mood.split(' ')[0]}
                  </ThemedText>
                  <ThemedText style={styles.moodText}>
                    {entry.mood.split(' ')[1]}
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
                    <ThemedText style={[
                      styles.entryContent,
                      prompt.startsWith("It sounds like") && styles.suggestionText
                    ]}>
                      {response}
                    </ThemedText>
                  )}
                </View>
              );
            })}
          </View>
        )) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>No journal entries yet</ThemedText>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    textTransform: 'capitalize',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: Theme.colors.primary,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  promptText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#FA8072", // Salmon pink to match app theme
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
  },
  entryDate: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.textLight,
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: Theme.colors.text,
    marginBottom: 16,
  },
  suggestionText: {
    color: Theme.colors.text,
    fontStyle: 'normal',
    marginTop: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.textLight,
  }
});