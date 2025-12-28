import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/constants/theme';
import AppNavigator from './src/navigation';

import { UserProvider, useUser } from './src/context/UserContext';

const AppContent = () => {
  const { checkAuthStatus, isLoading } = useUser();
  
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  if (isLoading) {
    // You can return a loading component here
    return null; // For now, return null while checking auth status
  }
  
  return (
    <AppNavigator />
  );
};

export default function App() {
  return (
    <UserProvider>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </UserProvider>
  );
}
