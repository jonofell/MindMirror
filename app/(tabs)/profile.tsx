
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/Theme';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  return (
    <LinearGradient
      colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
      style={styles.container}
    >
      <ThemedText style={styles.logo}>MindMirror</ThemedText>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Profile</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/coach-settings')}
        >
          <ThemedText style={styles.buttonText}>Coach Settings</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Subscription</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              router.replace('/login');
            } catch (error) {
              console.error("Error signing out:", error);
            }
          }}
        >
          <ThemedText style={styles.buttonText}>Log Out</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]}
          onPress={async () => {
            try {
              // Clear local storage
              await AsyncStorage.clear();
              
              // Clear Supabase entries
              const { error } = await supabase
                .from('entries')
                .delete()
                .neq('id', '0');
                
              if (error) {
                console.error("Error clearing Supabase:", error);
                return;
              }
              
              console.log("Storage cleared successfully");
            } catch (error) {
              console.error("Error clearing storage:", error);
            }
          }}
        >
          <ThemedText style={[styles.buttonText, styles.dangerText]}>Reset Journal</ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    fontSize: 40,
    fontFamily: 'Poppins_600SemiBold',
    color: Theme.colors.primary,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2D3142',
    fontFamily: 'Poppins_400Regular',
  },
  dangerButton: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FFD0D0',
  },
  dangerText: {
    color: '#FF0000',
  },
});
