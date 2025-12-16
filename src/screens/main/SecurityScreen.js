import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Button, Divider } from 'react-native-paper';
import { Colors, Spacing } from '../../constants/colors';

export default function SecurityScreen({ navigation }) {
    const [biometrics, setBiometrics] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Subheader>Login Security</List.Subheader>
                <List.Item
                    title="Biometric Login"
                    description="Use Fingerprint or FaceID"
                    left={props => <List.Icon {...props} icon="fingerprint" />}
                    right={() => <Switch value={biometrics} onValueChange={setBiometrics} color={Colors.primary} />}
                />
                <List.Item
                    title="Two-Factor Authentication"
                    description="Receive OTP via SMS"
                    left={props => <List.Icon {...props} icon="shield-account-outline" />}
                    right={() => <Switch value={twoFactor} onValueChange={setTwoFactor} color={Colors.primary} />}
                />
            </List.Section>

            <Divider />

            <View style={styles.section}>
                <Button mode="outlined" onPress={() => { }} style={styles.button}>
                    Change Password
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    section: {
        padding: Spacing.m
    },
    button: {
        marginTop: Spacing.m
    }
});
