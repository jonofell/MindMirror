
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VOICES = [
  {
    id: 'coach',
    title: 'The Coach',
    description: 'Supportive & goal-oriented',
    example: '"What\'s one thing you can take action on today?"',
    icon: '⭐️'
  },
  {
    id: 'mirror',
    title: 'The Mirror',
    description: 'Neutral & reflective',
    example: '"You\'ve mentioned this before—want to go deeper?"',
    icon: '🍃'
  },
  {
    id: 'poet',
    title: 'The Poet',
    description: 'Dreamy & expressive',
    example: '"You floated through the day like a paper boat..."',
    icon: '💗'
  }
];

export default function CoachSettingsScreen() {
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState('mirror');

  const saveVoiceSelection = async (voiceId: string) => {
    try {
      await AsyncStorage.setItem('selected_voice', voiceId);
      setSelectedVoice(voiceId);
    } catch (error) {
      console.error('Error saving voice selection:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ThemedText style={styles.backText}>← Back</ThemedText>
      </TouchableOpacity>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Choose Your{'\n'}Journaling Voice</ThemedText>
          <ThemedText style={styles.subtitle}>Pick a tone that feels right for you.</ThemedText>
          <ThemedText style={styles.description}>Your journal can reflect like a mirror, guide like a coach, or dream like a poet.</ThemedText>
        </View>

        {VOICES.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            style={[
              styles.voiceCard,
              selectedVoice === voice.id && styles.selectedVoice
            ]}
            onPress={() => saveVoiceSelection(voice.id)}
          >
            <View style={styles.voiceHeader}>
              <View style={styles.iconContainer}>
                <ThemedText style={styles.icon}>{voice.icon}</ThemedText>
              </View>
              <View style={styles.voiceInfo}>
                <ThemedText style={styles.voiceTitle}>{voice.title}</ThemedText>
                <ThemedText style={styles.voiceDescription}>{voice.description}</ThemedText>
              </View>
              <View style={[
                styles.radioButton,
                selectedVoice === voice.id && styles.radioButtonSelected
              ]} />
            </View>
            <ThemedText style={styles.example}>{voice.example}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 15,
    paddingTop: 60,
  },
  backText: {
    fontSize: 18,
    color: '#2D3142',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#E88D72',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: '#2D3142',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  voiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedVoice: {
    borderColor: '#E88D72',
    borderWidth: 2,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  voiceInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  voiceTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2D3142',
    marginBottom: 2,
  },
  voiceDescription: {
    fontSize: 14,
    color: '#666',
  },
  example: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 56,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  radioButtonSelected: {
    borderColor: '#E88D72',
    backgroundColor: '#E88D72',
  }
});
