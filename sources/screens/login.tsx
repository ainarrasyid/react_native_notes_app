import API from '@helpers/api';
import localStorageOperation from '@helpers/local-storage-operation';
import {StackScreenPropsType} from '@models/navigators';
import {Color} from '@references/constants/color';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

function Login({route, navigation}: StackScreenPropsType<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkLoginSession();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
      }}
      style={{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: Color.superDarkGray,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 42,
              fontWeight: '700',
            }}>
            My Notes
          </Text>
          <Image
            source={require('../assets/images/login.png')}
            style={{
              height: 250,
              width: 250,
            }}
          />
        </View>

        <TextInput
          placeholder="Email"
          onChangeText={newValue => setEmail(newValue)}
          placeholderTextColor={Color.gray}
          style={{
            backgroundColor: Color.dark,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: Color.gray,
            padding: 20,
            marginBottom: 20,
            color: 'white',
          }}
        />
        <TextInput
          placeholder="Password"
          onChangeText={newValue => setPassword(newValue)}
          placeholderTextColor={Color.gray}
          secureTextEntry
          style={{
            backgroundColor: Color.dark,
            borderWidth: 1,
            borderRadius: 20,
            borderColor: Color.gray,
            padding: 20,
            color: 'white',
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 100,
        }}>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text
            style={{
              color: Color.gray,
            }}>
            Don't have an account?
            <Text
              style={{
                color: 'white',
                fontWeight: '500',
              }}>
              {'  Register'}
            </Text>
          </Text>
        </Pressable>
      </View>
      <TouchableOpacity
        onPress={handleSignIn}
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 50,
          margin: 20,
        }}>
        <Text
          style={{
            color: Color.superDarkGray,
            fontSize: 16,
            textAlign: 'center',
            fontWeight: '500',
          }}>
          Sign In
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
  async function handleSignIn() {
    const response = await API.Login({
      email,
      password,
    });
    if (response.json.data !== undefined) {
      await localStorageOperation.setItem('LOGIN', response.json.data);
      navigation.replace('Home');
    } else {
      Alert.alert('Kesalahan', response.json.api_message);
    }
  }

  async function checkLoginSession() {
    const loginData = await localStorageOperation.getItem('LOGIN');

    if (loginData !== undefined) {
      navigation.replace('Home');
    }
  }
}

export default Login;
