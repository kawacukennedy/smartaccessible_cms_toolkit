import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import './src/lib/i18n/i18n'; // Import i18n configuration
import { useTranslation } from 'react-i18next';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotificationProvider, useNotifications } from './src/contexts/NotificationContext';
import { AISuggestionProvider } from './src/contexts/AISuggestionContext';
import { UndoRedoProvider } from './src/contexts/UndoRedoContext';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import TelemetryConsentModal from './src/components/TelemetryConsentModal'; // Import TelemetryConsentModal
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import MobileNotificationRenderer from './src/components/MobileNotificationRenderer';

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
  const { highContrast, toggleHighContrast, reducedMotion, toggleReducedMotion, fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();

  const containerStyle = theme === 'dark' ? darkStyles.container : lightStyles.container;
  const headerStyle = theme === 'dark' ? darkStyles.header : lightStyles.header;
  const headerTitleStyle = theme === 'dark' ? darkStyles.headerTitle : lightStyles.headerTitle;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const triggerSampleNotification = () => {
    addNotification({
      displayType: 'toast',
      style: 'info',
      message: 'This is a sample info notification!',
    });
    addNotification({
      displayType: 'toast',
      style: 'success',
      message: 'Content saved successfully!',
    });
    addNotification({
      displayType: 'toast',
      style: 'warning',
      message: 'Review accessibility suggestions.',
    });
    addNotification({
      displayType: 'toast',
      style: 'error',
      message: 'Failed to publish content.',
    });
  };

  const getFontSize = () => {
    if (fontSize === 'small') return 14;
    if (fontSize === 'large') return 18;
    return 16;
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle, highContrast && styles.highContrastContainer]}>
      <View style={[styles.header, headerStyle]}>
        <Text style={[styles.headerTitle, headerTitleStyle, { fontSize: getFontSize() + 4 }]}>SmartAccessible CMS Toolkit</Text>
        <View style={styles.headerControls}>
          <TouchableOpacity onPress={() => changeLanguage(i18n.language === 'en' ? 'fr' : 'en')} style={styles.languageSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              {i18n.language === 'en' ? t('french') : t('english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={triggerSampleNotification} style={styles.themeSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              {t('switch_theme', { theme: theme === 'light' ? 'Dark' : 'Light' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleHighContrast} style={styles.themeSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              {highContrast ? 'HC Off' : 'HC On'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={increaseFontSize} style={styles.themeSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              A+
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={decreaseFontSize} style={styles.themeSwitcher}>
            <Text style={[theme === 'dark' ? { color: '#fff' } : { color: '#000' }, { fontSize: getFontSize() }]}>
              A-
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
            if (route.name === 'Home') {
              label = t('home');
            } else if (route.name === 'Content') {
              label = t('content');
            } else if (route.name === 'Scan') {
              label = t('scan');
            } else if (route.name === 'Media') {
              label = t('media');
            } else if (route.name === 'Profile') {
              label = t('profile');
            }
            return <Text style={{ color: color, fontSize: 10 }}>{label}</Text>;
          },
        })}
      >
        <Tab.Screen name="Home">
          {props => <ScreenWrapper {...props}><DashboardScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Content">
          {props => <ScreenWrapper {...props}><ContentScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Scan">
          {props => <ScreenWrapper {...props}><AIScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Media">
          {props => <ScreenWrapper {...props}><NotificationsScreen /></ScreenWrapper>}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {props => <ScreenWrapper {...props}><SettingsScreen /></ScreenWrapper>}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [telemetryConsent, setTelemetryConsent] = useState<boolean | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    const loadConsent = async () => {
      try {
        const consent = await AsyncStorage.getItem('telemetryConsent');
        if (consent !== null) {
          setTelemetryConsent(JSON.parse(consent));
        } else {
          setShowConsentModal(true);
        }
      } catch (e) {
        console.error('Failed to load telemetry consent', e);
        setShowConsentModal(true);
      }
    };
    loadConsent();
  }, []);

  const handleConsent = async (consent: boolean) => {
    try {
      await AsyncStorage.setItem('telemetryConsent', JSON.stringify(consent));
      setTelemetryConsent(consent);
      setTelemetryEnabled(consent); // Update telemetry.ts
      setShowConsentModal(false);
    } catch (e) {
      console.error('Failed to save telemetry consent', e);
    }
  };

  return (
    <NotificationProvider>
      <ThemeProvider>
        <AISuggestionProvider>
          <OnboardingProvider>
            <UndoRedoProvider>
              <AccessibilityProvider>
                <AppContent />
                <MobileNotificationRenderer />
                <TelemetryConsentModal
                  isVisible={showConsentModal}
                  onAccept={() => handleConsent(true)}
                  onDecline={() => handleConsent(false)}
                />
              </AccessibilityProvider>
            </UndoRedoProvider>
          </OnboardingProvider>
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
  },
  highContrastContainer: {
    filter: 'contrast(200%)',
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
