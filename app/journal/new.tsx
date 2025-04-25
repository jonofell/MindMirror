
import { useRouter } from 'expo-router';
import React, { useState, useLayoutEffect, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ScrollView, Keyboard, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

const PROMPTS = [
  "What's on your mind?",
  "It sounds like you might be feeling a bit frustrated or overwhelmed. What's been going on that's led you to feel this way?",
  "It seems like there's a lot you might want to express. What's been the most challenging part of your day or week so far?",
  "It sounds like you might be feeling a bit stuck or unsure about how to express yourself right now. Is there something specific you'd like to dive into?",
];

export default function NewJournalEntry() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isWriting, setIsWriting] = useState(true);
  const [currentEntry, setCurrentEntry] = useState('');
  const scrollViewRef = useRef(null);

  const handleSubmitEntry = () => {
    if (!currentEntry.trim()) return;
    
    setEntries([...entries, { text: currentEntry, prompt: PROMPTS[currentPrompt] }]);
    setCurrentEntry('');
    setIsWriting(false);
    Keyboard.dismiss();
    
    if (currentPrompt < PROMPTS.length - 1) {
      setCurrentPrompt(prev => prev + 1);
    }
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
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

  useLayoutEffect(() => {
    router.setParams({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginLeft: 16, marginTop: 8 }}
        >
          <ThemedText style={{ fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: '#2D3142' }}>
            ← Back
          </ThemedText>
        </TouchableOpacity>
      ),
    });
  }, [router]);

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <ThemedText style={styles.prompt}>{entry.prompt}</ThemedText>
            <View style={styles.textBubble}>
              <ThemedText>{entry.text}</ThemedText>
            </View>
          </View>
        ))}
        
        {!isWriting && (
          <View style={styles.entryContainer}>
            <ThemedText style={styles.prompt}>{PROMPTS[currentPrompt]}</ThemedText>
            <TouchableOpacity 
              style={styles.writeButton} 
              onPress={() => setIsWriting(true)}
            >
              <Text style={styles.writeButtonText}>Write</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {isWriting && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentEntry}
            onChangeText={setCurrentEntry}
            multiline
            autoFocus
            placeholder="Write your thoughts..."
            placeholderTextColor={Theme.colors.textLight}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmitEntry}
            >
              <ThemedText style={styles.buttonText}>Continue</ThemedText>
            </TouchableOpacity>
            {entries.length > 0 && (
              <TouchableOpacity 
                style={[styles.button, styles.finishButton]} 
                onPress={saveEntry}
              >
                <ThemedText style={styles.buttonText}>Finish Entry</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
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
  scrollContent: {
    padding: Theme.spacing.lg,
    paddingTop: 100,
  },
  entryContainer: {
    marginBottom: 24,
  },
  prompt: {
    fontSize: 16,
    color: '#4A78C8',
    marginBottom: 12,
  },
  textBubble: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  writeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  writeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    padding: Theme.spacing.lg,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    minHeight: 100,
    maxHeight: 150,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.md,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    flex: 1,
    marginHorizontal: 4,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});
