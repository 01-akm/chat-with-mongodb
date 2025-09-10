import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getMyProfile, updateProfile } from '../utils/api';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setUsername(profile.username);
        setEmail(profile.email);
        if (profile.profileImage) {
          setProfileImage(`http://10.185.199.89:5000${profile.profileImage}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch profile data.');
        console.error('Profile fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', "You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const profileData = { username, email, profileImage };
      const response = await updateProfile(profileData);
      Alert.alert('Success', response.msg || 'Profile updated!');
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/images/icon.png')
          }
          style={styles.avatar}
        />
        <TouchableOpacity onPress={handleChoosePhoto}>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Save Changes" onPress={handleSaveChanges} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  avatarContainer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ccc' },
  changePhotoText: { color: '#007BFF', marginTop: 10, fontSize: 16 },
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: {
    backgroundColor: 'white',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
