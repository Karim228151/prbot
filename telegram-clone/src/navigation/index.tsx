import React from 'react';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ChatScreen from '../screens/ChatScreen';
import NewChatScreen from '../screens/NewChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type AppStackParamList = {
  Chats: undefined;
  Chat: { threadId: string; threadName: string };
  NewChat: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const AppStack = createNativeStackNavigator<AppStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const Loading: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const AppNavigator: React.FC = () => {
  const { currentUser, isInitializing } = useAuth();

  if (isInitializing) {
    return <Loading />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {currentUser ? (
        <AppStack.Navigator>
          <AppStack.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
          <AppStack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.threadName })} />
          <AppStack.Screen name="NewChat" component={NewChatScreen} options={{ title: 'New chat' }} />
          <AppStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;