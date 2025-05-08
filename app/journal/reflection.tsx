
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

export default function ReflectionScreen() {
  const router = useRouter();
  const { reflection, error } = useLocalSearchParams();

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
        <ThemedText style={styles.title}>Your Reflection</ThemedText>
        
        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Sorry, we couldn't generate a reflection. Please try again.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.reflectionCard}>
            <ThemedText style={styles.reflectionText}>{reflection}</ThemedText>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <ThemedText style={styles.doneButtonText}>Done</ThemedText>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: 'Poppins_600SemiBold',
    color: Theme.colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
  },
  reflectionCard: {
    backgroundColor: Theme.colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reflectionText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
    color: Theme.colors.text,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  doneButton: {
    backgroundColor: Theme.colors.primary,
    margin: 16,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});
