
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.background, '#FFF']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>Good{'\n'}Morning</ThemedText>
          <ThemedText style={styles.subtitle}>Let's tune in. What's on your mind?</ThemedText>
        </View>

        <TouchableOpacity 
          style={styles.mainButton}
          onPress={() => router.push('/journal/new')}
        >
          <LinearGradient
            colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.mainButtonText}>✍️ Start journaling</ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secondaryButtonsContainer}>
          <TouchableOpacity style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>🕯️ Set intention</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/coach-settings')}
          >
            <ThemedText style={styles.secondaryButtonText}>⚙️ Coach Settings</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.entryCard}
          onPress={() => router.push('/journal')}
        >
          <ThemedText style={styles.entryTitle}>Latest Entry</ThemedText>
          <ThemedText style={styles.entryText}>
            Today I felt really productive. Made progress on several projects and had a great meditation session...
          </ThemedText>
          <ThemedText style={styles.entryTime}>2 hours ago</ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: '15%',
    marginBottom: 30,
  },
  greeting: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 40,
    color: Theme.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 18,
    color: Theme.colors.text,
  },
  mainButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientButton: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 30,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  entryCard: {
    backgroundColor: Theme.colors.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Theme.shadows.soft,
  },
  entryTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  entryText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.text,
    marginBottom: 12,
  },
  entryTime: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: Theme.colors.textLight,
  },
});
