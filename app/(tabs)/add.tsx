
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>New Entry</ThemedText>
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
