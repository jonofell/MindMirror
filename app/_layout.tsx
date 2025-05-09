import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

import { ThemedText } from '@/components/ThemedText';

function RootLayoutNav() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
          </>
        )}
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { syncOfflineEntries } from '@/lib/offlineStorage';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Theme } from '@/constants/Theme';

export function RootLayoutNew() {
  const isConnected = useNetworkStatus();

  useEffect(() => {
    if (isConnected) {
      syncOfflineEntries();
    }
  }, [isConnected]);

  return (
    <ErrorBoundary>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <ThemedText style={styles.offlineText}>
            You are offline. Changes will be saved locally.
          </ThemedText>
        </View>
      )}
      <Stack />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: Theme.colors.primary,
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});