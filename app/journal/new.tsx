import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

const PROMPTS = [
  "What's on your mind?",
  "It sounds like you might be feeling a bit frustrated or overwhelmed. What's been going on that's led you to feel this way?",
  "It seems like there's a lot you might want to express. What's been the most challenging part of your day or week so far?",
];

export default function NewJournalEntry() {
  const router = useRouter();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState<{text: string, prompt: string}[]>([]);

  const handleSubmitEntry = () => {
    if (!currentEntry.trim()) return;

    setEntries([...entries, { text: currentEntry, prompt: PROMPTS[currentPrompt] }]);
    setCurrentEntry('');

    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(prev => prev + 1);
    }
  };

  const saveEntry = async () => {
    try {
      const newEntry = {
        id: Date.now().toString(),
        content: entries.map(e => `${e.prompt}\n${e.text}`).join('\n\n'),
        timestamp: Date.now(),
      };

      const existingEntries = await AsyncStorage.getItem('journal_entries');
      const allEntries = existingEntries ? JSON.parse(existingEntries) : [];
      allEntries.unshift(newEntry);
      await AsyncStorage.setItem('journal_entries', JSON.stringify(allEntries));

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <ThemedText style={styles.entryPrompt}>{entry.prompt}</ThemedText>
            <ThemedText style={styles.entryText}>{entry.text}</ThemedText>
          </View>
        ))}

        <View style={styles.currentPromptContainer}>
          <ThemedText style={styles.prompt}>{PROMPTS[currentPrompt]}</ThemedText>
          <TextInput
            style={styles.input}
            value={currentEntry}
            onChangeText={setCurrentEntry}
            multiline
            placeholder="Write..."
            placeholderTextColor="#666"
          />
        </View>
      </View>

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
          <ThemedText style={styles.buttonText}>Finish entry</ThemedText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  currentPromptContainer: {
    marginBottom: 20,
  },
  entryContainer: {
    marginBottom: 24,
  },
  prompt: {
    fontSize: 16,
    color: '#4A78C8',
    marginBottom: 12,
    fontFamily: 'Poppins_400Regular',
  },
  entryPrompt: {
    fontSize: 16,
    color: '#4A78C8',
    marginBottom: 8,
    fontFamily: 'Poppins_400Regular',
  },
  entryText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  finishButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});