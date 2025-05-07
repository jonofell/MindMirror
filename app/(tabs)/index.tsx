import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { Theme } from "@/constants/Theme";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();
  const [latestEntry, setLatestEntry] = useState("");
  const [userName, setUserName] = useState("Friend");
  const [streak, setStreak] = useState(0);

  const calculateStreak = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem("journal_entries");
      if (storedEntries) {
        const entries = JSON.parse(storedEntries);
        if (entries.length > 0) {
          let currentStreak = 0;
          let lastDate = null;
          for (let i = entries.length -1; i >=0; i--){
            const entryDate = new Date(entries[i].timestamp);
            const dateString = entryDate.toDateString();

            if (lastDate === null || dateString === new Date(lastDate).toDateString() || new Date(lastDate).getDate() === new Date(entryDate).getDate() +1 ){
              currentStreak++;
              lastDate = entries[i].timestamp;
            } else {
              break;
            }
          }
          setStreak(currentStreak);
          return currentStreak;
        }
      }
      return 0;
    } catch (error) {
      console.error("Error calculating streak:", error);
      return 0;
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setLatestEntry("");
      setStreak(0);
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
            <TouchableOpacity style={styles.secondaryButton}>
              <IconSymbol name="flame.fill" size={20} color="#000" />
              <ThemedText style={styles.secondaryButtonText}>Set intention</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <IconSymbol name="waveform" size={20} color="#000" />
              <ThemedText style={styles.secondaryButtonText}>Talk to a Coach</ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.clearStorageButton}
            onPress={clearStorage}
          >
            <IconSymbol name="trash" size={16} color="#FF0000" />
            <ThemedText style={styles.clearStorageText}>Clear Local Storage</ThemedText>
          </TouchableOpacity>

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
    backgroundColor: '#FF7E67',
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
    ...Theme.shadows.soft,
  },
  secondaryButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
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