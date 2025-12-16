import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/constants/theme';
import AppNavigator from './src/navigation';

import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </UserProvider>
  );
}
