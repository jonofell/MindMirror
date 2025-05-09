import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';
import { MoodLineChart } from '@/components/charts/MoodLineChart';
import { MoodStreakChart } from '@/components/charts/MoodStreakChart';
import { MoodInsights } from '@/components/charts/MoodInsights';
import { MoodAnalysis } from '@/components/charts/MoodAnalysis';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';
import { supabase } from '@/lib/supabase';

export default function StatsScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: entriesData } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user?.id);

      if (entriesData) {
        setEntries(entriesData);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      const storedEntries = await AsyncStorage.getItem('journal_entries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
        style={styles.gradient}
      >
        <ThemedText style={styles.title}>Weekly Mood{'\n'}Reflection</ThemedText>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Mood Over Time</ThemedText>
          <MoodLineChart entries={entries} />
        </View>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Longest Mood Streaks</ThemedText>
          <MoodStreakChart entries={entries} />
        </View>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Mood Insights</ThemedText>
          <MoodInsights entries={entries} />
        </View>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Mood Analysis</ThemedText>
          <MoodAnalysis entries={entries} />
        </View>
      </LinearGradient>
    </ScrollView>
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
    paddingTop: 60,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Poppins_600SemiBold',
    color: Theme.colors.primary,
    marginBottom: 30,
  },
  chartContainer: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: 20,
    marginBottom: 20,
    ...Theme.shadows.soft,
  },
  chartTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: Theme.colors.text,
    marginBottom: 16,
  },
});