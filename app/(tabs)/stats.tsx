import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Statistics</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 60,
  },
});