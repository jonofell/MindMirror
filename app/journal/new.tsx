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
  SafeAreaView,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { supabase } from "@/lib/supabase";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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
  const [selectedMood, setSelectedMood] = useState<string>("");
  const moods = ["😊 Happy", "😌 Calm", "😰 Anxious", "😢 Sad", "😠 Angry"];

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

      console.log("Sending entry to Edge Function");

      // ✅ FIXED: Send both prompt and response
      const { data: reflectionData, error: reflectionError } =
        await supabase.functions.invoke("clever-processor", {
          body: {
            entries: finalEntries.map((entry) => ({
              prompt: entry.prompt,
              response: entry.text,
            })),
            mood: selectedMood,
            timestamp: new Date().toISOString(),
          },
        });

      if (reflectionError) {
        console.error("Edge function error:", reflectionError);
        throw new Error("Failed to generate reflection");
      }

      const reflection =
        reflectionData?.reflection || "No reflection returned.";

      if (!selectedMood) {
        alert("Please select a mood before finishing your entry");
        return;
      }

      // Save to Supabase
      const { data: entryData, error: entryError } = await supabase
        .from("entries")
        .insert([
          {
            id: uuidv4(),
            content: entryContent,
            reflection,
            mood: selectedMood,
            timestamp: Math.floor(Date.now() / 1000),
          },
        ])
        .select();

      if (entryError) {
        console.error("Supabase save error:", entryError);
        throw new Error(`Failed to save entry: ${entryError.message}`);
      }

      // Save locally (optional)
      const existingEntries = await AsyncStorage.getItem("journal_entries");
      const allEntries = existingEntries ? JSON.parse(existingEntries) : [];
      if (entryData && entryData[0]) {
        allEntries.unshift(entryData[0]);
        await AsyncStorage.setItem(
          "journal_entries",
          JSON.stringify(allEntries),
        );
      }

      // Navigate to reflection screen
      router.push({
        pathname: "/journal/reflection",
        params: { reflection },
      });
    } catch (err) {
      console.error("Error saving entry:", err);
      router.push({
        pathname: "/journal/reflection",
        params: {
          error:
            err.message === "AI processing failed"
              ? "Failed to generate reflection"
              : "Failed to save entry",
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FFDAB9", "#ADD8E6"]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex:1 }}
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
                <ThemedText style={styles.entryPrompt}>
                  {entry.prompt}
                </ThemedText>
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
              <View style={styles.moodContainer}>
                <ThemedText style={styles.moodLabel}>
                  How are you feeling?
                </ThemedText>
                <View style={styles.moodPicker}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodButton,
                        selectedMood === mood && styles.selectedMoodButton,
                      ]}
                      onPress={() => setSelectedMood(mood)}
                    >
                      <ThemedText
                        style={[
                          styles.moodButtonText,
                          selectedMood === mood &&
                            styles.selectedMoodButtonText,
                        ]}
                      >
                        {mood}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitEntry}
            >
              <ThemedText style={styles.buttonText}>Suggest</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.finishButton]}
              onPress={saveEntry}
            >
              <ThemedText
                style={[styles.buttonText, styles.finishButtonText]}
              >
                Submit
              </ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  moodContainer: {
    marginTop: 16,
  },
  moodLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "Poppins_600SemiBold",
  },
  moodPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  selectedMoodButton: {
    backgroundColor: Theme.colors.primary,
  },
  moodButtonText: {
    color: Theme.colors.primary,
    fontFamily: "Poppins_600SemiBold",
  },
  selectedMoodButtonText: {
    color: "#fff",
  },
  container: {
    flex: 1,
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
    padding: 24,
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