import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '../utils/api';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username ||!password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    try {
      const userData = { username, password };
      const data = await login(userData);
      await SecureStore.setItemAsync('userToken', data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'ChatList' }],
      });
    } catch (error) {
      const message = error.response?.data?.msg || 'Invalid username or password.';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chatoos</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // <-- Important Fix
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none" // <-- Important Fix
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

// Styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;