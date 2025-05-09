import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { supabase } from "@/lib/supabase";

export default function HomeScreen() {
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState("");
  const [userName, setUserName] = useState("Friend");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const getUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      }
    };
    getUserName();
  }, []);

  const calculateStreak = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("journal_entries");
      if (!storedEntries) return 0;

      const entries = JSON.parse(storedEntries);
      if (entries.length === 0) return 0;

      // Sort entries by timestamp in descending order (newest first)
      const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);

      // Check if the most recent entry is from today or yesterday
      const mostRecentDate = new Date(sortedEntries[0].timestamp * 1000);
      const today = new Date();
      const dayDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

      // If the most recent entry is older than yesterday, streak is 0
      if (dayDiff > 1) {
        setStreak(0);
        return 0;
      }

      let currentStreak = 1;
      let lastDate = new Date(sortedEntries[0].timestamp * 1000);

      // Count consecutive days
      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = new Date(sortedEntries[i].timestamp * 1000);
        const daysBetween = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysBetween === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else {
          break;
        }
      }

      setStreak(currentStreak);
      return currentStreak;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 0;
    }
  };

  const clearStorage = async () => {
    try {
      // Clear local storage
      await AsyncStorage.clear();
      setLatestEntry("");
      setStreak(0);

      // Clear Supabase entries
      const { error } = await supabase
        .from('entries')
        .delete()
        .neq('id', '0'); // Delete all entries

      if (error) {
        console.error("Error clearing Supabase:", error);
        return;
      }

      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  useEffect(() => {
    const loadLatestEntry = async () => {
      try {
        const storedEntries = await AsyncStorage.getItem("journal_entries");
        console.log("Stored entries:", storedEntries);
        if (storedEntries) {
          const entries = JSON.parse(storedEntries);
          console.log("Parsed entries:", entries);
          if (entries.length > 0) {
            setLatestEntry(entries[0].content.split('\n\n')[1] || entries[0].content);
          }
        }
      } catch (error) {
        console.error("Error loading latest journal entry:", error);
      }
    };

    loadLatestEntry();
    calculateStreak();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5E5', '#E5F0FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.greeting}>
              Good Morning,{'\n'}{userName}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Let's tune in. What's on your mind?
            </ThemedText>
            <ThemedText style={styles.streakText}>Current Streak: {streak} days</ThemedText>
          </View>

          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => router.push('/journal/new')}
          >
            <IconSymbol name="pencil" size={24} color="#FFF" />
            <ThemedText style={styles.mainButtonText}>Start journaling</ThemedText>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.activeButton]}
              onPress={() => router.push('/coach-settings')}
            >
              <View style={styles.buttonContent}>
                <IconSymbol name="waveform" size={20} color={Theme.colors.text} />
                <ThemedText style={styles.secondaryButtonText}>Coach Settings</ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.disabledButton]}
              disabled={true}
            >
              <View style={styles.buttonContent}>
                <IconSymbol name="waveform" size={20} color={Theme.colors.textLight} />
                <View>
                  <ThemedText style={[styles.secondaryButtonText, styles.disabledText]}>Set Intention</ThemedText>
                  <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          </View>



          {latestEntry && latestEntry.length > 0 && (
            <View style={styles.entryCard}>
              <ThemedText style={styles.entryTitle}>Latest Entry</ThemedText>
              <ThemedText style={styles.entryText}>{latestEntry}</ThemedText>
            </View>
          )}

          <View style={styles.bottomContainer}>
            <ThemedText style={styles.versionText}>MindMirror Beta v1.4</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeButton: {
    backgroundColor: Theme.colors.card,
  },
  disabledButton: {
    backgroundColor: Theme.colors.cardLight,
    opacity: 0.7,
  },
  disabledText: {
    color: Theme.colors.textLight,
  },
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF7E67',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 10,
  },
  streakText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: Theme.colors.primary,
    padding: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Theme.shadows.soft,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.soft,
  },
  secondaryButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
  },
  comingSoonText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginLeft: 8,
  },
  entryCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    ...Theme.shadows.soft,
  },
  entryTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
  },
  entryText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 15,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#FFF0F0',
  },
  clearButtonText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#FF0000',
    fontFamily: 'Poppins_600SemiBold',
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins_600SemiBold',
    opacity: 0.7,
  },
  clearStorageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#FFF0F0',
  },
  clearStorageText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#FF0000',
    fontFamily: 'Poppins_600SemiBold',
  },
});