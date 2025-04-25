import { useRouter } from 'expo-router';
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

export default function NewJournalEntry() {
  const router = useRouter();
  const [entry, setEntry] = useState('');

  const saveEntry = async () => {
    try {
      const newEntry = {
        id: Date.now().toString(),
        content: entry,
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
        style={styles.container}
      >
        <View style={styles.content}>
          <ThemedText style={styles.question}>What's on your mind?</ThemedText>

          <TextInput
            style={styles.input}
            value={entry}
            onChangeText={setEntry}
            placeholder="Write your thoughts..."
            multiline
            placeholderTextColor={Theme.colors.textLight}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={saveEntry}
          >
            <ThemedText style={styles.buttonText}>
              Finish Entry
            </ThemedText>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.lg,
    paddingTop: 100,
  },
  question: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: Theme.spacing.xl,
    color: Theme.colors.text,
  },
  input: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Theme.colors.text,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : Theme.spacing.lg,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});