import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import socket from '../utils/socket';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import CallScreen from '../screens/CallScreen';
import ProfileScreen from '../screens/ProfileScreen'; // <-- Import the new screen

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleIncomingCall = (data) => {
      Alert.alert(
        'Incoming Call',
        `${data.callerName} is calling you.`,
       
      );
    };

    socket.on('incoming-call', handleIncomingCall);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
    };
  }, [navigation]);

  return (
    <Stack.Navigator initialRouteName="AuthLoading">
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;