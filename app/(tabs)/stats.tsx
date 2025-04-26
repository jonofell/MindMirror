import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import { MoodLineChart } from '@/components/charts/MoodLineChart';
import { BubbleChart } from '@/components/charts/BubbleChart';
import { Theme } from '@/constants/Theme';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.background, '#FFF']}
        style={styles.gradient}
      >
        <ThemedText style={styles.title}>Weekly Mood{'\n'}Reflection</ThemedText>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Mood Over Time</ThemedText>
          <MoodLineChart />
        </View>

        <View style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>Mood vs Entry Length</ThemedText>
          <BubbleChart />
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
    paddingTop: '15%',
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