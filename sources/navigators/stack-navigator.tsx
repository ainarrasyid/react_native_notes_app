import React from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigatorParameters} from '@models/navigators';

import Home from '@screens/home';
import PickImage from '@screens/pick-image';
import Profile from '@screens/profile';
import Login from '@screens/login';
import Register from '@screens/register';
import {Color} from '@references/constants/color';
import AddNote from '@screens/note-add';

const Stack = createStackNavigator<NavigatorParameters>();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // false to remove header
        gestureEnabled: true, // default true for ios, false for android
      }}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerStyle: {
            backgroundColor: Color.superDarkGray,
            elevation: 0,
          },
          title: 'Register',
          headerTitleAlign: 'center',
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: 'React Native Starter',
        }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerBackTitleVisible: false,
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="AddNotes"
        component={AddNote}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerBackTitleVisible: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          title: 'Add Note',
        }}
      />
      <Stack.Screen
        name="PickImage"
        component={PickImage}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: 'dodgerblue',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          title: 'Pick Image',
        }}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
