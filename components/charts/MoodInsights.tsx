
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';
import { JournalEntry } from '@/types/journal';

interface Props {
  entries: JournalEntry[];
}

export function MoodInsights({ entries }: Props) {
  const calculateMoodStats = () => {
    if (!entries.length) return null;

    const moodCounts: { [key: string]: number } = {};
    let mostFrequentMood = '';
    let maxCount = 0;

    entries.forEach(entry => {
      if (!entry.mood) return;
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      if (moodCounts[entry.mood] > maxCount) {
        maxCount = moodCounts[entry.mood];
        mostFrequentMood = entry.mood;
      }
    });

    // Calculate mood trend (last 7 entries)
    const recentEntries = [...entries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7);
    
    const moodMap: { [key: string]: number } = {
      '😊 Happy': 5,
      '😌 Calm': 4,
      '😰 Anxious': 2,
      '😢 Sad': 1,
      '😠 Angry': 1
    };

    const moodTrend = recentEntries.reduce((acc, entry) => {
      return acc + (moodMap[entry.mood] || 3);
    }, 0) / recentEntries.length;

    return {
      totalEntries: entries.length,
      mostFrequentMood,
      moodTrend: moodTrend >= 3.5 ? 'positive' : moodTrend >= 2.5 ? 'neutral' : 'negative'
    };
  };

  const stats = calculateMoodStats();

  if (!stats) return null;

  return (
    <View style={styles.container}>
      <View style={styles.insightCard}>
        <ThemedText style={styles.insightTitle}>Most Common Mood</ThemedText>
        <ThemedText style={styles.insightValue}>{stats.mostFrequentMood.split(' ')[0]}</ThemedText>
      </View>
      
      <View style={styles.insightCard}>
        <ThemedText style={styles.insightTitle}>Recent Mood Trend</ThemedText>
        <ThemedText style={styles.insightValue}>
          {stats.moodTrend === 'positive' ? '📈 Improving' : 
           stats.moodTrend === 'neutral' ? '➡️ Stable' : '📉 Declining'}
        </ThemedText>
      </View>

      <View style={styles.insightCard}>
        <ThemedText style={styles.insightTitle}>Total Entries</ThemedText>
        <ThemedText style={styles.insightValue}>{stats.totalEntries}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  insightCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: Theme.colors.cardLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 14,
    color: Theme.colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  insightValue: {
    fontSize: 20,
    color: Theme.colors.primary,
    fontFamily: 'Poppins_600SemiBold',
  }
});
