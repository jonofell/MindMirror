
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Theme } from '@/constants/Theme';

interface Props {
  onRetry: () => void;
  label?: string;
}

export function RetryButton({ onRetry, label = 'Retry' }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onRetry}>
      <ThemedText style={styles.text}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
});
