import './global.css';

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BMIScreen from './src/screens/BMIScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import WHRScreen from './src/screens/WHRScreen';

const Tab = createBottomTabNavigator();

const TAB_ACCENTS = {
  BMI: '#6366F1',
  WHR: '#0D9488',
};

export default function App() {
  const [onboarded, setOnboarded] = useState(false);

  if (!onboarded) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onGetStarted={() => setOnboarded(true)} />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: TAB_ACCENTS[route.name],
            tabBarInactiveTintColor: '#A3A3A3',
            tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#EDEDED',
              borderTopWidth: 1,
              height: 88,
              paddingTop: 8,
            },
            tabBarIcon: ({ color, focused }) => {
              const name =
                route.name === 'BMI'
                  ? focused
                    ? 'body'
                    : 'body-outline'
                  : focused
                    ? 'resize'
                    : 'resize-outline';
              return (
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: focused ? `${TAB_ACCENTS[route.name]}1A` : 'transparent',
                  }}
                >
                  <Ionicons name={name} size={20} color={color} />
                </View>
              );
            },
          })}
        >
          <Tab.Screen name="BMI" component={BMIScreen} />
          <Tab.Screen name="WHR" component={WHRScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
