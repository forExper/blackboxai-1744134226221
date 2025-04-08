import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NoteProvider } from '../context/NoteContext';
import { TagProvider } from '../context/TagContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <NoteProvider>
          <TagProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </TagProvider>
        </NoteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
