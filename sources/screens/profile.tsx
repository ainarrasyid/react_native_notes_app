import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import {StackScreenPropsType} from '@models/navigators';
import {Color} from '@references/constants/color';
import localStorageOperation from '@helpers/local-storage-operation';
import LoginInterface from '@models/login-data';

function Profile({navigation, route}: StackScreenPropsType<'Profile'>) {
  const [pickedImage, setPickedImage] = useState('');
  const [userData, setUserData] = useState<LoginInterface>();

  const imageSize = 175;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Color.green,
        shadowColor: Color.superDarkGray,
        height: 70,
        elevation: 10,
      },
      headerTintColor: 'white',
      headerTitle: 'Profile',
      headerTitleAlign: 'center',
    });
    getUserData();
  }, []);

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Color.superDarkGray,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          alignItems: 'center',
          borderColor: 'gray',
          borderRadius: imageSize / 2,
          borderStyle: pickedImage ? 'solid' : 'dashed',
          borderWidth: 3,
          height: imageSize,
          justifyContent: 'center',
          marginTop: 32,
          overflow: 'hidden',
          width: imageSize,
        }}>
        {pickedImage ? (
          <Image
            source={{uri: pickedImage}}
            style={{
              height: imageSize,
              width: imageSize,
            }}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'gray',
                fontSize: 20,
              }}>
              No Image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          marginVertical: 10,
        }}>
        {userData?.name}
      </Text>
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
        }}>
        {userData?.email}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignOut}
        style={{
          backgroundColor: '#d50000',
          width: 200,
          borderRadius: 8,
          elevation: 4,
          marginHorizontal: 20,
          marginTop: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          shadowColor: 'dimgray',
          shadowOffset: {
            height: 2,
            width: 0,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '500',
          }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  async function handleSignOut() {
    await localStorageOperation.removeItem('LOGIN');
    navigation.replace('Login');
  }

  async function getUserData() {
    const data = await localStorageOperation.getItem('LOGIN');
    setUserData(data);
    setPickedImage(data!.image);
  }
}

export default Profile;
