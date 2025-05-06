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
              <ThemedText style={styles.entryDate}>
                {new Date(entry.timestamp).toLocaleDateString()}
              </ThemedText>
              {entry.mood && (
                <ThemedText style={styles.entryMood}>{entry.mood}</ThemedText>
              )}
            </View>
            {entry.content.split("\n\n").map((section, index) => {
              const parts = section.split("\n");
              const prompt = parts[0];
              const response = parts.slice(1).join("\n") || "";
              return response ? (
                <View key={index}>
                  {!isCollapsed && prompt.startsWith("It sounds like") && (
                    <ThemedText style={styles.promptText}>
                      {prompt}
                    </ThemedText>
                  )}
                  <ThemedText style={[
                    styles.entryContent,
                    prompt.startsWith("It sounds like") && styles.suggestionText
                  ]}>
                    {response}
                  </ThemedText>
                </View>
              ) : null;
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
    alignItems: "center",
    marginBottom: 8,
  },
  entryMood: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: Theme.colors.primary,
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
    color: "#FF69B4", // Pink color
    marginBottom: 4,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 60,
    marginBottom: 20,
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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
    marginTop: 8,
    color: Theme.colors.text,
  },
  suggestionText: {
    color: Theme.colors.text,
    fontStyle: 'normal',
  },
});
