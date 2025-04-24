
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

const FOLLOW_UP_RESPONSES = {
  work: "That's great to hear about your work progress! How does it make you feel?",
  good: "I'm glad you're feeling good! What made today special?",
  tired: "I hear you about being tired. What would help you feel more energized?",
  default: "Thanks for sharing. Could you tell me more about that?"
};

export default function NewJournalEntry() {
  const router = useRouter();
  const [currentInput, setCurrentInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const getResponse = (input) => {
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput.includes('work')) return FOLLOW_UP_RESPONSES.work;
    if (lowercaseInput.includes('good')) return FOLLOW_UP_RESPONSES.good;
    if (lowercaseInput.includes('tired')) return FOLLOW_UP_RESPONSES.tired;
    return FOLLOW_UP_RESPONSES.default;
  };

  const handleContinue = () => {
    if (!currentInput.trim()) return;

    const newConversation = [...conversation, 
      { text: currentInput, isUser: true }
    ];

    if (conversation.length < 2) {
      const response = getResponse(currentInput);
      newConversation.push({ text: response, isUser: false });
      setIsFinished(false);
    } else {
      setIsFinished(true);
    }

    setConversation(newConversation);
    setCurrentInput('');
  };

  const saveEntry = async () => {
    try {
      const content = conversation
        .map(msg => `${msg.isUser ? "You" : "MindMirror"}: ${msg.text}`)
        .join('\n\n');

      const newEntry = {
        id: Date.now().toString(),
        content,
        timestamp: Date.now(),
      };

      const existingEntries = await AsyncStorage.getItem('journal_entries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
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
          
          {conversation.map((entry, index) => (
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
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.lg,
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
