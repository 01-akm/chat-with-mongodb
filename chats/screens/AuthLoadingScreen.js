import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await SecureStore.getItemAsync('userToken');

        navigation.reset({
          index: 0,
          routes: userToken
           ? [{ name: 'ChatList' }] // Corrected name to match our navigator
            : [{ name: 'Login' }],
        });
      } catch (e) {
        console.error('Failed to fetch the token from storage', e);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkLoginStatus();
  },); // Using an empty array is standard for "run once"

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingScreen;