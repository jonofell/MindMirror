
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

interface DialogueEntry {
  text: string;
  isUser: boolean;
}

export default function NewJournalEntry() {
  const router = useRouter();
  const [currentInput, setCurrentInput] = useState('');
  const [dialogue, setDialogue] = useState<DialogueEntry[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const followUpQuestions = [
    "That's great to hear! What specific accomplishments are you proud of?",
    "How does this progress make you feel?",
    "What helped you stay focused and productive today?",
  ];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const addToDialogue = (text: string, isUser: boolean) => {
    setDialogue(prev => [...prev, { text, isUser }]);
  };

  const handleContinue = () => {
    if (!currentInput.trim()) return;

    addToDialogue(currentInput, true);
    setCurrentInput('');

    if (currentQuestionIndex < followUpQuestions.length - 1) {
      const nextQuestion = followUpQuestions[currentQuestionIndex + 1];
      addToDialogue(nextQuestion, false);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const saveEntry = async () => {
    try {
      const content = dialogue
        .map(entry => `${entry.isUser ? "You" : "MindMirror"}: ${entry.text}`)
        .join('\n\n');

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content,
        timestamp: Date.now(),
      };

      const existingEntries = await AsyncStorage.getItem('journal_entries');
      const entries: JournalEntry[] = existingEntries 
        ? JSON.parse(existingEntries)
        : [];

      entries.unshift(newEntry);
      await AsyncStorage.setItem('journal_entries', JSON.stringify(entries));
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <View style={styles.dialogueContainer}>
          <ThemedText style={styles.question}>What's on your mind?</ThemedText>
          
          {dialogue.map((entry, index) => (
            <View 
              key={index} 
              style={[
                styles.messageContainer,
                entry.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <ThemedText style={styles.messageText}>{entry.text}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentInput}
            onChangeText={setCurrentInput}
            placeholder="Write your thoughts..."
            multiline
            placeholderTextColor={Theme.colors.textLight}
          />
          
          <TouchableOpacity
            style={[styles.button, isFinished && styles.finishButton]}
            onPress={isFinished ? saveEntry : handleContinue}
          >
            <ThemedText style={styles.buttonText}>
              {isFinished ? 'Finish Entry' : 'Continue'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  dialogueContainer: {
    padding: Theme.spacing.lg,
  },
  question: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: Theme.spacing.xl,
    color: Theme.colors.text,
  },
  messageContainer: {
    marginVertical: Theme.spacing.md,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.lg,
    maxWidth: '90%',
  },
  userMessage: {
    backgroundColor: Theme.colors.primary,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: Theme.colors.card,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: Theme.colors.text,
    fontFamily: 'Inter_400Regular',
  },
  inputContainer: {
    padding: Theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    minHeight: 100,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
    ...Theme.shadows.soft,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
