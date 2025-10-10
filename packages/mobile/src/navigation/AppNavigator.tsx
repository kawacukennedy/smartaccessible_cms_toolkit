import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import ContentScreen from '../screens/ContentScreen';
import AIScreen from '../screens/AIScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ThemeBuilderScreen from '../screens/ThemeBuilderScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import PerformanceScreen from '../screens/PerformanceScreen';
import AdvancedContentEditorScreen from '../screens/AdvancedContentEditorScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CollaborationPanel from '../components/CollaborationPanel';
import SecurityDashboard from '../components/SecurityDashboard';
import CloudSyncDashboard from '../components/CloudSyncDashboard';
import AdvancedSearch from '../components/AdvancedSearch';
import MobileGestureHandler from '../components/MobileGestureHandler';
import MobileVoiceNavigation from '../components/MobileVoiceNavigation';
import { GestureEvent, VoiceCommand, globalGestureSupport } from '../lib/mobileGestureSupport';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = ({ showVoiceNavigation, setShowVoiceNavigation }: {
  showVoiceNavigation: boolean;
  setShowVoiceNavigation: (show: boolean) => void;
}) => {
  const handleGesture = (event: GestureEvent) => {
    console.log('Gesture detected:', event);
    // Handle global gestures here
    if (event.type === 'doubleTap') {
      setShowVoiceNavigation(true);
    }
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Voice command:', command);
    // Handle voice commands globally
    switch (command.action) {
      case 'close_modal':
        setShowVoiceNavigation(false);
        break;
      // Add more global voice command handlers as needed
    }
  };

  return (
    <MobileGestureHandler onGesture={handleGesture}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Content" component={ContentScreen} />
        <Tab.Screen name="Scan" component={AIScreen} />
        <Tab.Screen name="Media" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={SettingsScreen} />
      </Tab.Navigator>

      <MobileVoiceNavigation
        isVisible={showVoiceNavigation}
        onClose={() => setShowVoiceNavigation(false)}
        onVoiceCommand={handleVoiceCommand}
      />
    </MobileGestureHandler>
  );
};

const AppNavigator = () => {
  const [showVoiceNavigation, setShowVoiceNavigation] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main">
        {(props) => (
          <MainTabNavigator
            {...props}
            showVoiceNavigation={showVoiceNavigation}
            setShowVoiceNavigation={setShowVoiceNavigation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ThemeBuilder" component={ThemeBuilderScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Performance" component={PerformanceScreen} />
       <Stack.Screen name="AdvancedContentEditor" component={AdvancedContentEditorScreen} />
       <Stack.Screen name="Onboarding" component={OnboardingScreen} />
       <Stack.Screen name="Collaboration" component={CollaborationPanel} />
       <Stack.Screen name="Security" component={SecurityDashboard} />
       <Stack.Screen name="CloudSync" component={CloudSyncDashboard} />
       <Stack.Screen name="AdvancedSearch" component={AdvancedSearch} />
     </Stack.Navigator>
  );
};

export default AppNavigator;
