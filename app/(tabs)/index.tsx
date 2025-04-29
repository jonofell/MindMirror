
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";

export default function HomeScreen() {
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState(""); 

  useEffect(() => {
    const loadLatestEntry = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("journal_entries");
        if (storedEntries) {
          const entries = JSON.parse(storedEntries);
          if (entries.length > 0) {
            // Get first paragraph of content
            const content = entries[0].content.split('\n\n')[1] || entries[0].content;
            setLatestEntry(content);
          }
        }
      } catch (error) {
        console.error("Error loading latest journal entry:", error);
      }
    };

    loadLatestEntry();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.background, '#FFF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Good{'\n'}Morning</ThemedText>
          <ThemedText style={styles.subtitle}>Let's tune in. What's on your mind?</ThemedText>
        </View>

        <TouchableOpacity 
          style={styles.entryCard}
          onPress={() => router.push('/journal')}
        >
          <ThemedText style={styles.entryTitle}>Latest Entry</ThemedText>
          <ThemedText style={styles.entryText}>
            {latestEntry || "No entries yet. Start journaling!"}
          </ThemedText>
          <ThemedText style={styles.entryTime}>Today</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.textLight,
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  entryTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: 12,
  },
  entryTime: {
    fontSize: 14,
    color: Theme.colors.textLight,
  },
});
