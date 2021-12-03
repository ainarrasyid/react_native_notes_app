import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';

import {StackScreenPropsType} from '@models/navigators';

import {executeNotificationData} from '@references/functions/notification-actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Color} from '@references/constants/color';
import ListNoteInterface from '@models/list-note';
import API from '@helpers/api';
import localStorageOperation from '@helpers/local-storage-operation';
import BottomSheet from '@gorhom/bottom-sheet';
import Modules from '../modules';

function Home({navigation, route}: StackScreenPropsType<'Home'>) {
  const [data, setData] = useState<ListNoteInterface[]>([]);
  const [note, setNote] = useState('');
  const [noteID, setNoteID] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetCurrentSnapIndex, setBottomSheetCurrentSnapIndex] =
    useState(0);

  useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener('focus', () => {
      // Called when each time this screen focus
      if (Modules.isNeedToRefreshNote) {
        Modules.isNeedToRefreshNote = false;
        loadData();
      }
    });

    return unsubscribeFocusListener;
  }, [navigation]);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          executeNotificationData(remoteMessage.data);
        }
      });
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Color.green,
        shadowColor: Color.superDarkGray,
        height: 70,
        elevation: 10,
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{
            marginRight: 20,
          }}>
          <Icon name="user-circle" size={30} color="white" />
        </TouchableOpacity>
      ),
      headerTintColor: 'white',
      headerTitle: 'Notes',
      headerTitleAlign: 'left',
    });
    loadData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          marginBottom: 60,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',

                borderBottomWidth: 1,
                borderColor: '#EAEAEA',
              }}>
              <View
                style={{
                  width: '80%',
                }}>
                <Text
                  style={{
                    color: Color.dark,
                  }}>
                  {item.note}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                  }}>{`Dibuat pada : ${item.created_at}`}</Text>
              </View>

              <TouchableOpacity
                style={{
                  width: '10%',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}
                onPress={() => {
                  Modules.isEditNote = true;
                  setNote(item.note);
                  setNoteID(item.id);
                  bottomSheetRef.current?.snapTo(1);
                }}>
                <Icon name="pencil" size={25} color={Color.green} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '10%',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}
                onPress={() => deleteNote(item.id)}>
                <Icon name="trash" size={25} color="#D52027" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        handleComponent={null}
        snapPoints={[60, 200]}
        onChange={index => setBottomSheetCurrentSnapIndex(index)}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            if (bottomSheetCurrentSnapIndex == 0 && !Modules.isEditNote) {
              bottomSheetRef.current?.snapTo(1);
            }
          }}
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            flexDirection: 'row',
            borderColor: '#EAEAEA',
            borderTopWidth: 1,
            height: 60,
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: '#3D3D3B',
              fontWeight: '600',
            }}>
            {Modules.isEditNote ? 'Edit Note' : 'Tambah Note'}
          </Text>
          <Icon
            name={Modules.isEditNote ? 'edit' : 'plus'}
            size={20}
            color="#3D3D3B"
          />
        </TouchableOpacity>
        <TextInput
          placeholder={Modules.isEditNote ? 'Edit Note' : 'Tambah Note'}
          value={note}
          onChangeText={newValue => setNote(newValue)}
          style={{
            borderColor: Color.gray,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current?.snapTo(0);
              Modules.isEditNote = false;
              setNote('');
            }}
            style={{
              flexGrow: 1,
              borderColor: Color.green,
              borderWidth: 1,
              padding: 15,
              borderRadius: 10,
              marginLeft: 20,
              marginRight: 5,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: Color.green,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              Modules.isEditNote
                ? () => {
                    editNote(noteID);
                  }
                : addNote
            }
            style={{
              flexGrow: 1,
              backgroundColor: Color.green,
              padding: 15,
              borderRadius: 10,
              marginLeft: 5,
              marginRight: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
              }}>
              {Modules.isEditNote ? 'Edit Note' : 'Tambah Note'}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );

  async function loadData() {
    const loginData = await localStorageOperation.getItem('LOGIN');
    const res = await API.List({user_id: loginData!.id});
    if (res.json !== undefined) {
      setData([...res.json.data].reverse());
    }
  }

  async function deleteNote(id: number) {
    const LoginData = await localStorageOperation.getItem('LOGIN');
    Alert.alert('Peringatan', 'Apakah anda yakin akan menghapus note ini', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const res = await API.Delete({user_id: LoginData!.id, note_id: id});
          if (res.json.data !== undefined) {
            loadData();
          }
        },
      },
    ]);
  }

  async function addNote() {
    const user = await localStorageOperation.getItem('LOGIN');
    const res = await API.Save({user_id: user!.id, note});
    if (res.json.data !== undefined) {
      Modules.isNeedToRefreshNote = true;
      setNote('');
      loadData();
    }
  }

  async function editNote(note_id: number) {
    const user = await localStorageOperation.getItem('LOGIN');
    const res = await API.Update({user_id: user!.id, note_id, note});
    if (res.json.data !== undefined) {
      Modules.isNeedToRefreshNote = true;
      Modules.isEditNote = false;
      setNote('');
      setNoteID(0);
      loadData();
    }
  }
}

export default Home;
