import API from '@helpers/api';
import {StackScreenPropsType} from '@models/navigators';
import {Color} from '@references/constants/color';
import ImagePicker from 'react-native-image-crop-picker';
import React, {useState} from 'react';

import {
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';

type FileType = {
  uri: string;
  name: string;
  type: string;
};

function Register({route, navigation}: StackScreenPropsType<'Register'>) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(0);
  const [image, setImage] = useState<FileType>();
  const [pickedImage, setPickedImage] = useState('');

  const imageSize = 175;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
      }}
      style={{
        flex: 1,
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
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={showImagePickerAlert}
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
        </View>
        <TextInput
          placeholder="Your Name"
          onChangeText={newValue => setName(newValue)}
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
          secureTextEntry
          onChangeText={newValue => setPassword(newValue)}
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
          placeholder="Phone"
          keyboardType="number-pad"
          onChangeText={newValue => setPhone(parseInt(newValue))}
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
      </View>
      <TouchableOpacity
        onPress={handleRegister}
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
          Register
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  async function handleRegister() {
    const res = await API.Register({
      name,
      email,
      password,
      phone,
    });
    console.log(image);
    if (res.json.data !== undefined) {
      navigation.goBack();
    } else {
      Alert.alert('Kesalahan', res.json.api_message);
    }
  }

  function showImagePickerAlert() {
    Alert.alert(
      'Ambil Gambar',
      'Ambil gambar dengan',
      [
        {
          text: 'Kamera',
          onPress: openCamera,
        },
        {
          text: 'Galeri',
          onPress: openImagePicker,
        },
      ],
      {cancelable: true},
    );
  }

  function openCamera() {
    ImagePicker.openCamera({
      /**
        @property compressImageQuality
        @default -> android: 1 | iOS: 0.8

        Dari 0 hingga 1.
        Di iOS, nilai yang lebih besar dari 0,8 tidak 
        menghasilkan peningkatan kualitas yang nyata di sebagian besar gambar.
        Sementara nilai 0,8 akan mengurangi ukuran file sekitar setengah atau kurang dibandingkan dengan nilai 1.
      */
      compressImageQuality: 0.8,
      cropperCancelText: 'Batal',
      cropperChooseText: 'Terapkan',
      height: 500,
      multiple: false, // default: false
      width: 500,
    }).then(image => setPickedImage(image.path));
  }

  function openImagePicker() {
    ImagePicker.openPicker({
      compressImageQuality: 0.8,
      cropperCancelText: 'Batal',
      cropperChooseText: 'Terapkan',
      height: 500,
      width: 500,
    }).then(image => {
      setPickedImage(image.path);
      setImage({
        uri: image.path,
        name: image.filename || new Date().getTime().toString(),
        type: image.mime,
      });
    });
  }
}

export default Register;
