
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

export default function CoachSettingsScreen() {
  const [selectedVoice, setSelectedVoice] = useState('mirror');

  const voices = [
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
      example: '"You've mentioned this before—want to go deeper?"',
      icon: '🍃'
    },
    {
      id: 'poet',
      title: 'The Poet',
      description: 'Dreamy & expressive',
      example: '"You floated through the day like a paper boat..."',
      icon: '💗'
    },
    {
      id: 'inner_child',
      title: 'The Inner Child',
      description: 'Playful & emotional',
      example: '"Hey... what made you smile today?"',
      icon: '💙'
    }
  ];

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Choose Your{'\n'}Journaling Voice</ThemedText>
          <ThemedText style={styles.subtitle}>Pick a tone that feels right for you.{'\n'}You can always change it later.</ThemedText>
          <ThemedText style={styles.description}>Your journal can reflect like a mirror, guide like a coach,{'\n'}or dream like a poet. Who do you want to write with today?</ThemedText>
        </View>

        {voices.map((voice) => (
          <TouchableOpacity
            key={voice.id}
            style={[
              styles.voiceOption,
              selectedVoice === voice.id && styles.selectedVoice
            ]}
            onPress={() => setSelectedVoice(voice.id)}
          >
            <View style={styles.voiceHeader}>
              <View style={styles.voiceIconContainer}>
                <ThemedText style={styles.voiceIcon}>{voice.icon}</ThemedText>
              </View>
              <View style={styles.voiceTitleContainer}>
                <ThemedText style={styles.voiceTitle}>{voice.title}</ThemedText>
                <ThemedText style={styles.voiceDescription}>{voice.description}</ThemedText>
              </View>
              <View style={[
                styles.radioButton,
                selectedVoice === voice.id && styles.radioButtonSelected
              ]} />
            </View>
            <ThemedText style={styles.voiceExample}>{voice.example}</ThemedText>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.blendOption}>
          <View style={styles.blendContainer}>
            <ThemedText style={styles.blendText}>Blend voices based on entry style</ThemedText>
            <View style={styles.radioButton} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#E88D72',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#2D3142',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  voiceOption: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  selectedVoice: {
    borderColor: '#E88D72',
    borderWidth: 2,
  },
  voiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  voiceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 24,
  },
  voiceTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  voiceTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2D3142',
  },
  voiceDescription: {
    fontSize: 14,
    color: '#666',
  },
  voiceExample: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 55,
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
  },
  blendOption: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
  },
  blendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blendText: {
    fontSize: 16,
    color: '#2D3142',
  },
});
