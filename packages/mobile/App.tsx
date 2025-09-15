import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import './src/lib/i18n/i18n'; // Import i18n configuration
import { useTranslation } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotificationProvider, useNotifications } from './src/contexts/NotificationContext';

// Import Screens
import DashboardScreen from './src/screens/DashboardScreen';
import ContentScreen from './src/screens/ContentScreen';
import AIScreen from './src/screens/AIScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ContentEditorScreen from './src/screens/ContentEditorScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// This component will be used for each screen to provide the header, theme, and language switcher
function ScreenWrapper({ children, navigation }: { children: React.ReactNode, navigation: any }) {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { addNotification } = useNotifications();

  const containerStyle = theme === 'dark' ? darkStyles.container : lightStyles.container;
  const headerStyle = theme === 'dark' ? darkStyles.header : lightStyles.header;
  const headerTitleStyle = theme === 'dark' ? darkStyles.headerTitle : lightStyles.headerTitle;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const triggerSampleNotification = () => {
    addNotification({
      type: 'info',
      message: 'This is a sample info notification!',
    });
    addNotification({
      type: 'success',
      message: 'Content saved successfully!',
    });
    addNotification({
      type: 'warning',
      message: 'Review accessibility suggestions.',
    });
    addNotification({
      type: 'error',
      message: 'Failed to publish content.',
    });
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.headerTitle, headerTitleStyle]}>SmartAccessible CMS Toolkit</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity onPress={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')} style={styles.languageSwitcher}>
            <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>
              {i18n.language === 'en' ? t('french') : t('english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={triggerSampleNotification} style={styles.themeSwitcher}>
            <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>
              Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeSwitcher}>
            <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>
              {t('switch_theme', { theme: theme === 'light' ? 'Dark' : 'Light' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentWrapper}>
        {children}
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Hide default header as we have a custom one
          tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#000',
          tabBarInactiveTintColor: theme === 'dark' ? '#ccc' : '#888',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#343a40' : '#f8f8f8',
          },
          tabBarLabel: ({ focused, color }) => {
            let label;
            if (route.name === 'Dashboard') {
              label = t('dashboard');
            } else if (route.name === 'Content') {
              label = t('content');
            } else if (route.name === 'ContentEditor') { // New tab label
              label = t('content_editor');
            }
            return <Text style={{ color: color, fontSize: 10 }}>{label}</Text>;
          },
        })}
      >
        <Tab.Screen name="Dashboard">
          {props => <ScreenWrapper {...props}><DashboardScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Content">
          {props => <ScreenWrapper {...props}><ContentScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="AI">
          {props => <ScreenWrapper {...props}><AIScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Notifications">
          {props => <ScreenWrapper {...props}><NotificationsScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {props => <ScreenWrapper {...props}><SettingsScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="ContentEditor"> {/* New Tab Screen */}
          {props => <ScreenWrapper {...props}><ContentEditorScreen /></ScreenWrapper>}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AISuggestionProvider>
          <AppContent />
        </AISuggestionProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  themeSwitcher: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginLeft: 10,
  },
  languageSwitcher: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: { // Removed as it's no longer directly in App.tsx
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: { // Removed as it's no longer directly in App.tsx
    fontSize: 16,
  }
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#eee',
  },
  headerTitle: {
    color: '#000',
  },
  content: {
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f0f0f0',
  }
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#212529',
  },
  header: {
    backgroundColor: '#343a40',
    borderBottomColor: '#555',
  },
  headerTitle: {
    color: '#fff',
  },
  content: {
    backgroundColor: '#212529',
  },
  button: {
    backgroundColor: '#555',
  }
});
