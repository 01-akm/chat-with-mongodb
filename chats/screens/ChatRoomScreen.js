import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import socket from '../utils/socket';
import { getChatHistory } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const ChatRoomScreen = ({ route, navigation }) => {
  const { recipientId, recipientName } = route.params;
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState(null); // <-- FIXED missing state
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: recipientName,
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Call', {
                recipientId,
                recipientName,
                callType: 'voice',
              })
            }
          >
            <Ionicons name="call" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Call', {
                recipientId,
                recipientName,
                callType: 'video',
              })
            }
          >
            <Ionicons name="videocam" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [recipientName, navigation, recipientId]);

  useEffect(() => {
    const initializeChat = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentUserId = decodedToken.user.id;
        setSenderId(currentUserId);
        socket.emit('registerUser', currentUserId);
      }
      try {
        const history = await getChatHistory(recipientId);
        setMessages(history);
      } catch (error) {
        console.error('Failed to load chat history', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    initializeChat();
  }, [recipientId]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  },);

  const handleSend = () => {
    if (newMessage.trim() === '' ||!senderId) return;
    const messageData = {
      senderId,
      recipientId,
      content: newMessage.trim(),
    };
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios'? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {loadingHistory? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.senderId === senderId
                  ? styles.sentBubble
                  : styles.receivedBubble,
              ]}
            >
              <Text>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 15,
  },
  messagesContainer: { padding: 10 },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentBubble: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  receivedBubble: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});

export default ChatRoomScreen;