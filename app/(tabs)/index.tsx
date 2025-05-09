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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUserName();
  }, []);

  const calculateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      if (!entries || entries.length === 0) return 0;

      const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);
      const mostRecentDate = new Date(sortedEntries[0].timestamp * 1000);
      const today = new Date();
      const dayDiff = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff > 1) {
        setStreak(0);
        return 0;
      }

      let currentStreak = 1;
      let lastDate = new Date(sortedEntries[0].timestamp * 1000);

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

  useEffect(() => {
    const loadLatestEntry = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: entries, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(1);

        if (error) throw error;
        if (entries && entries.length > 0) {
          const content = entries[0].content.split('\n\n')[1] || entries[0].content;
          setLatestEntry(content);
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
        colors={[Theme.colors.gradientStart, Theme.colors.gradientEnd]}
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
                <IconSymbol name="waveform" size={24} color={Theme.colors.primary} />
                <View style={styles.buttonTextContainer}>
                  <ThemedText style={styles.secondaryButtonText}>Coach Settings</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.secondaryButton, styles.disabledButton]}
              disabled={true}
            >
              <View style={styles.buttonContent}>
                <IconSymbol name="waveform" size={24} color={Theme.colors.textLight} />
                <View style={styles.buttonTextContainer}>
                  <ThemedText style={[styles.secondaryButtonText, styles.disabledText]}>Set Intention</ThemedText>
                  <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {latestEntry ? (
            <View style={styles.entryCard}>
              <ThemedText style={styles.entryTitle}>Latest Entry</ThemedText>
              <ThemedText style={styles.entryText}>{latestEntry}</ThemedText>
            </View>
          ) : null}

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
    gap: 12,
    padding: 4,
  },
  buttonTextContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  activeButton: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  disabledButton: {
    backgroundColor: Theme.colors.cardLight,
    opacity: 0.8,
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
  },
  entryTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
  },
  entryText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 15,
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
});