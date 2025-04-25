
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HapticTab } from '@/components/HapticTab';
import { TabBarBackground } from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FA8072',
        tabBarInactiveTintColor: '#FA8072',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            height: 65,
            position: 'absolute',
          },
          default: {
            height: 65,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
