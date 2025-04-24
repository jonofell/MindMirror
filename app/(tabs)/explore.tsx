import { StyleSheet } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Theme } from '@/constants/Theme';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore MindMirror</ThemedText>
      </ThemedView>

      <ThemedText style={styles.description}>
        Discover the features that make MindMirror your perfect journaling companion.
      </ThemedText>

      <Collapsible title="Daily Journaling">
        <ThemedText>
          Build a daily journaling habit with our intuitive interface. Write down your thoughts,
          feelings, and experiences in a safe and private space.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Mood Tracking">
        <ThemedText>
          Track your emotional well-being over time. MindMirror helps you understand your moods
          and identify patterns in your mental health journey.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Privacy First">
        <ThemedText>
          Your thoughts are yours alone. MindMirror ensures your entries are private and secure,
          stored safely on your device.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Beautiful Design">
        <ThemedText>
          A clean, minimalist interface that lets you focus on what matters most - your thoughts
          and feelings. Available in both light and dark modes.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Get Started">
        <ThemedText>
          Ready to begin your journaling journey? Head to the home tab and click "Start Journaling"
          to create your first entry.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: Theme.colors.textLight,
    marginBottom: Theme.spacing.xl,
    lineHeight: 24,
  },
});