import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedText from "@/components/ThemedText";
import Theme from "@/constants/Theme";

export default function HomeScreen() {
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState(""); // Latest journal content

  useEffect(() => {
    const loadLatestEntry = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("journal_entries");
        if (storedEntries) {
          const entries = JSON.parse(storedEntries);
          if (entries.length > 0) {
            setLatestEntry(entries[0].content); // Show latest
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
      <ThemedText style={styles.title}>Latest Journal Entry</ThemedText>
      <Text style={styles.entry}>{latestEntry || "No entries yet 😶"}</Text>

      <TouchableOpacity onPress={() => router.push("/journal/new")}>
        <Text style={styles.link}>Write a new entry →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  entry: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  link: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },
});
