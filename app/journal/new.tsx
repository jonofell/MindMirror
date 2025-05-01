import { useRouter } from "expo-router";
import React, { useState, useLayoutEffect, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { supabase } from "@/lib/supabase";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const PROMPTS = [
  "What's on your mind?",
  "It sounds like you might be feeling a bit frustrated or overwhelmed. What's been going on that's led you to feel this way?",
  "It seems like there's a lot you might want to express. What's been the most challenging part of your day or week so far?",
];

export default function NewJournalEntry() {
  const router = useRouter();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [currentEntry, setCurrentEntry] = useState("");
  const [entries, setEntries] = useState<{ text: string; prompt: string }[]>(
    [],
  );

  useLayoutEffect(() => {
    router.setParams({
      headerShown: false,
    });
  }, [router]);

  const scrollViewRef = useRef(null);

  const handleSubmitEntry = () => {
    if (!currentEntry.trim()) return;

    setEntries([
      ...entries,
      { text: currentEntry, prompt: PROMPTS[currentPrompt] },
    ]);
    setCurrentEntry("");

    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt((prev) => prev + 1);
    }

    // Scroll to the bottom after a short delay to ensure the new content is rendered
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const saveEntry = async () => {
    try {
      // Include the current entry if it's not empty
      const finalEntries = currentEntry.trim()
        ? [...entries, { text: currentEntry, prompt: PROMPTS[currentPrompt] }]
        : entries;

      const entryContent = finalEntries
        .map((e) => `${e.prompt}\n${e.text}`)
        .join("\n\n");

      // Send to Supabase Edge Function
      console.log("Sending entry to Edge Function");
      
      let reflection;
      try {
        const response = await fetch('https://odnbielvcdfieymckzbt.supabase.co/functions/v1/clever-processor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ content: entryContent }),
        });

        if (!response.ok) {
          throw new Error(`Edge Function failed: ${response.status}`);
        }

        const data = await response.json();
        reflection = data.choices?.[0]?.message?.content;
        
        if (!reflection) {
          throw new Error('No reflection received from Edge Function');
        }
      } catch (error) {
        console.error('Edge Function error:', error);
        reflection = "Unable to generate reflection at this time. Please try again later.";
      }

      // Save to Supabase with reflection
      const { data, error } = await supabase
        .from("entries")
        .insert([
          {
            id: uuidv4(),
            content: entryContent,
            reflection: reflection,
            timestamp: Math.floor(Date.now() / 1000),
          },
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to save entry: ${error.message}`);
      }

      console.log("Supabase response:", data);

      // Still save locally for offline access
      const existingEntries = await AsyncStorage.getItem("journal_entries");
      const allEntries = existingEntries ? JSON.parse(existingEntries) : [];
      allEntries.unshift(data[0]); // Use parsed data from Supabase response
      await AsyncStorage.setItem("journal_entries", JSON.stringify(allEntries));

      router.push({
        pathname: "/journal/reflection",
        params: { reflection },
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      router.push({
        pathname: "/journal/reflection",
        params: { error: "Failed to save or analyze entry" },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)")}
        style={styles.backButton}
      >
        <ThemedText style={styles.backButtonText}>← Back</ThemedText>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <ThemedText style={styles.entryPrompt}>{entry.prompt}</ThemedText>
            <ThemedText style={styles.entryText}>{entry.text}</ThemedText>
          </View>
        ))}

        <View style={styles.currentPromptContainer}>
          <ThemedText style={styles.prompt}>
            {PROMPTS[currentPrompt]}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={currentEntry}
            onChangeText={setCurrentEntry}
            multiline
            placeholder="Write..."
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmitEntry}>
          <ThemedText style={styles.buttonText}>Suggest</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={saveEntry}
        >
          <ThemedText style={[styles.buttonText, styles.finishButtonText]}>
            Finish entry
          </ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: Theme.colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  currentPromptContainer: {
    paddingBottom: 16,
  },
  entryContainer: {
    marginBottom: 24,
  },
  prompt: {
    fontSize: 16,
    color: Theme.colors.primary,
    marginBottom: 12,
    fontFamily: "Poppins_400Regular",
  },
  entryPrompt: {
    fontSize: 16,
    color: Theme.colors.primary,
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  entryText: {
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: 16,
    fontFamily: "Poppins_400Regular",
  },
  input: {
    fontSize: 16,
    color: Theme.colors.text,
    fontFamily: "Poppins_400Regular",
    padding: 0,
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  button: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  finishButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  buttonText: {
    color: Theme.colors.primary,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  finishButtonText: {
    color: "#fff",
  },
});