import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigate from './src/navigation/RootNavigate';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RealmProvider} from '@realm/react';
import {MediaEdited, MediaPicker} from './src/database/models';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <RealmProvider
      schema={[MediaPicker, MediaEdited]}
      schemaVersion={0}
      deleteRealmIfMigrationNeeded={true}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <RootNavigate />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </RealmProvider>
  );
};

export default App;
