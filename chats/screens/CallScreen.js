import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import socket from '../utils/socket';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const CallScreen = ({ route, navigation }) => {
  const { recipientId, recipientName, callType, offer } = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      peerConnection.current = new RTCPeerConnection(configuration);

      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video',
      });
      setLocalStream(stream);
      stream.getTracks().forEach(track =>
        peerConnection.current.addTrack(track, stream)
      );

      peerConnection.current.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            targetId: recipientId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.current.ontrack = event => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);

      if (offer) {
        // Answering a call
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer-call', { callerId: recipientId, signal: answer });
      } else {
        // Making a call
        const newOffer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(newOffer);
        socket.emit('call-user', {
          recipientId,
          callerId: decodedToken.user.id,
          callerName: 'A User', // Replace with actual user's name
          signal: newOffer,
        });
      }
    };

    initialize();

    socket.on('call-accepted', async data => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.signal)
      );
    });

    socket.on('ice-candidate', async data => {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    });

    socket.on('call-ended', () => {
      handleHangup();
    });

    return () => {
      socket.off('call-accepted');
      socket.off('ice-candidate');
      socket.off('call-ended');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHangup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    socket.emit('call-ended', { targetId: recipientId });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <View style={styles.remoteVideo}>
          <Text style={{ color: 'white' }}>
            Connecting to {recipientName}...
          </Text>
        </View>
      )}

      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
        />
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => alert('Mute')}
        >
          <Ionicons name="mic-off" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.hangupButton]}
          onPress={handleHangup}
        >
          <Ionicons name="call" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => alert('Switch Camera')}
        >
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#333' },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 120,
    height: 180,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 15,
    borderRadius: 50,
  },
  hangupButton: {
    backgroundColor: 'red',
  },
});

export default CallScreen;
