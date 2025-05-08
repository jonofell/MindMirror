import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { useRouter } from 'expo-router';

export default function CoachSettingsScreen() {
  const router = useRouter();
  const [selectedCoach, setSelectedCoach] = useState('mirror');

  const coaches = [
    {
      id: 'builder',
      title: 'The Builder',
      description: 'Practical & goal-oriented',
      example: '"Let\'s break this down into actionable steps..."',
      icon: '🛠️'
    },
    {
      id: 'buddhist',
      title: 'The Buddhist',
      description: 'Mindful & present',
      example: '"Notice how these feelings arise and pass..."',
      icon: '🪷'
    },
    {
      id: 'christian',
      title: 'The Christian',
      description: 'Faith-based guidance',
      example: '"Through faith, we find strength..."',
      icon: '✝️'
    },
    {
      id: 'mirror',
      title: 'The Mirror',
      description: 'Neutral & reflective',
      example: '"What do you see when you look deeper?"',
      icon: '🪞'
    }
  ];

  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ThemedText style={styles.backButtonText}>← Back</ThemedText>
      </TouchableOpacity>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Choose Your{'\n'}Reflection Guide</ThemedText>
          <ThemedText style={styles.subtitle}>Select a guide that resonates with you.{'\n'}You can change this anytime.</ThemedText>
        </View>

        {coaches.map((coach) => (
          <TouchableOpacity
            key={coach.id}
            style={[
              styles.coachOption,
              selectedCoach === coach.id && styles.selectedCoach
            ]}
            onPress={() => setSelectedCoach(coach.id)}
          >
            <View style={styles.coachHeader}>
              <View style={styles.coachIconContainer}>
                <ThemedText style={styles.coachIcon}>{coach.icon}</ThemedText>
              </View>
              <View style={styles.coachTitleContainer}>
                <ThemedText style={styles.coachTitle}>{coach.title}</ThemedText>
                <ThemedText style={styles.coachDescription}>{coach.description}</ThemedText>
              </View>
              <View style={[
                styles.radioButton,
                selectedCoach === coach.id && styles.radioButtonSelected
              ]} />
            </View>
            <ThemedText style={styles.coachExample}>{coach.example}</ThemedText>
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
    paddingTop: 50,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2D3142',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
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
  coachOption: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  selectedCoach: {
    borderColor: '#E88D72',
    borderWidth: 2,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  coachIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coachIcon: {
    fontSize: 24,
  },
  coachTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  coachTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#2D3142',
  },
  coachDescription: {
    fontSize: 14,
    color: '#666',
  },
  coachExample: {
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
  }
});