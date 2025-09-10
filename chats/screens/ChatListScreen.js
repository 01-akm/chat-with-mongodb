import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getAllUsers } from '../utils/api';
import socket from '../utils/socket';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen = ({ navigation }) => {
  const [users, setUsers] = useState(); // Initialize with an empty array
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    console.log('Logging out...');
    await SecureStore.deleteItemAsync('userToken');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="person-circle-outline" size={30} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Button onPress={handleLogout} title="Logout" color="#ff0000" />
      ),
    });
  }, [navigation, handleLogout]);

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to socket server with ID:', socket.id);
    });

    // --- NEW: Listen for user status updates ---
    const handleUserStatus = ({ userId, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId? {...user, status } : user
        )
      );
    };
    socket.on('userStatus', handleUserStatus);
    // --- END OF NEW LISTENER ---

    return () => {
      console.log('Disconnecting from socket server...');
      socket.off('userStatus', handleUserStatus); // Clean up the new listener
      socket.disconnect();
    };
  },);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [handleLogout]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                recipientId: item._id,
                recipientName: item.username,
              })
            }
          >
            {/* --- NEW: Status Indicator --- */}
            <View style={styles.userInfo}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: item.status === 'online'? '#4CAF50' : '#9E9E9E' },
                ]}
              />
              <Text style={styles.username}>{item.username}</Text>
            </View>
            {/* --- END OF NEW INDICATOR --- */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
  },
});

export default ChatListScreen;