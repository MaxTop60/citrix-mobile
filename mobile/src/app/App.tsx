import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './store';
import LoginScreen from '../features/auth/ui/LoginScreen';
import RegisterScreen from '../features/auth/ui/RegisterScreen';
import EventsScreen from '../features/events/ui/EventsScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Регистрация' }}
          />
          <Stack.Screen 
            name="Events" 
            component={EventsScreen} 
            options={{ title: 'События' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;