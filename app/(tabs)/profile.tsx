
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Profile</ThemedText>
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
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText>Profile</ThemedText>
    </View>
  );
}
