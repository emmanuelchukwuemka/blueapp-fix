import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import TaskDetailScreen from '../screens/main/TaskDetailScreen';
import NotificationScreen from '../screens/main/NotificationScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import SecurityScreen from '../screens/main/SecurityScreen';
import HelpCenterScreen from '../screens/main/HelpCenterScreen';
import TermsPrivacyScreen from '../screens/main/TermsPrivacyScreen';
import ChangePasswordScreen from '../screens/main/ChangePasswordScreen';
import TransactionDetailScreen from '../screens/main/TransactionDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="Main" component={MainNavigator} />
                <Stack.Screen
                    name="TaskDetail"
                    component={TaskDetailScreen}
                    options={{ headerShown: true, title: 'Task Details', headerBackTitle: 'Back' }}
                />
                <Stack.Screen
                    name="Notifications"
                    component={NotificationScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: true, title: 'Edit Profile' }} />
                <Stack.Screen name="Security" component={SecurityScreen} options={{ headerShown: true, title: 'Security' }} />
                <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ headerShown: true, title: 'Help Center' }} />
                <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} options={{ headerShown: true, title: 'Terms & Privacy' }} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
                <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
