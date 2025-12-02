import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.backgroundCard,
            text: colors.text,
            border: colors.backgroundLight,
            notification: colors.primary,
          },
        }}
      >
        <AppNavigator />
        <StatusBar style="light" backgroundColor={colors.background} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
