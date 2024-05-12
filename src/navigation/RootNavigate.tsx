import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import VideoEditor from '../screens/VideoEditor';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import VideoEditedPlayer from '../screens/VideoEditedPlayer';

const Stack = createNativeStackNavigator();

const RootNavigate = () => {
  const {top} = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {flex: 1, paddingTop: top},
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="VideoEditor"
          component={VideoEditor}
          options={{contentStyle: {paddingTop: 0}}}
        />
        <Stack.Screen name="VideoEditedPlayer" component={VideoEditedPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigate;
