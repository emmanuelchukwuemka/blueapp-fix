import { DefaultTheme } from 'react-native-paper';
import { Colors } from './colors';

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.primary,
        accent: Colors.secondary,
        background: Colors.background,
        surface: Colors.surface,
        error: Colors.error,
        text: Colors.text,
        onSurface: Colors.text,
        notification: Colors.error,
    },
};
