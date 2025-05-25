import { Tabs } from 'expo-router';
import { Image } from 'lucide-react-native';
import { History } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import { StyleSheet, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#9d4edd',
        tabBarInactiveTintColor: isDark ? '#888888' : '#555555',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#ffffff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Image size={size} color={color} />,
          headerTitle: 'AI Image Generator',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
          headerTitle: 'Generation History',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'App Settings',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopColor: '#333333',
    height: 60,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontWeight: '500',
    fontSize: 12,
  },
  header: {
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 18,
  },
});