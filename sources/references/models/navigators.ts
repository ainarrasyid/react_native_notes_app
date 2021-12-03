import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type NavigatorParameters = {
  Home: undefined;
  PickImage: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  AddNotes: undefined;
  EditNotes: {
    user_id: number;
    note_id: number;
    note: string;
  };
};

export type StackScreenPropsType<K extends keyof NavigatorParameters> = {
  route: RouteProp<NavigatorParameters, K>;
  navigation: StackNavigationProp<NavigatorParameters, K>;
};
