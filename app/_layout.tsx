import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js'
import { useState, createContext, useContext, useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//Supabase Client Initialization
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL; // Replace with your Supabase URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Context
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    initSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if(session){
        AsyncStorage.setItem('supabase-auth-session', JSON.stringify(session))
      } else {
        AsyncStorage.removeItem('supabase-auth-session')
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);


  const signInWithPassword = async (email, password) => {
    try {
      const { user, session } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("User:", user);
      console.log("Session:", session)
    } catch (error) {
      alert(error.message);
    }
  };

  const signUpWithPassword = async (email, password) => {
    try {
      const { user, session } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log("User:", user);
      console.log("Session:", session)
    } catch (error) {
      alert(error.message);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <AuthContext.Provider value={{ session, signInWithPassword, signUpWithPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const auth = useAuth();
  const session = auth?.session;
  const loading = auth?.loading;
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {session ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="login" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

//Example usage of Supabase and AuthContext in a component (add this to your relevant component)

// import {useAuth} from '../lib/AuthContext'

// const MyComponent = () => {
//   const {session, signInWithPassword, signUpWithPassword, signOut} = useAuth();

//   const createEntry = async (text) => {
//     if (!session) {
//       alert("Please sign in to create an entry.");
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from('entries')
//         .insert([{ text }]);
  
//       if (error) throw error;
//       console.log("Entry created:", data);
//     } catch (error) {
//       console.error("Error creating entry:", error);
//       alert("Failed to create entry. Please try again.");
//     }
//   };

//   const fetchEntries = async () => {
//     if (!session) {
//       alert("Please sign in to view entries.");
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from('entries')
//         .select('*');
  
//       if (error) throw error;
//       console.log("Entries fetched:", data);
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//       alert("Failed to fetch entries. Please try again.");
//     }
//   };

//   return (
//     <>
//       {/* ... your component JSX ... */}
//       <Button title="Create Entry" onPress={() => createEntry("test entry")} />
//       <Button title="Fetch Entries" onPress={fetchEntries} />
//       {session && <Button title="Sign Out" onPress={signOut}/>}
//     </>
//   );
// }