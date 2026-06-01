import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './store';
import LoginScreen from '../features/auth/ui/LoginScreen';
import RegisterScreen from '../features/auth/ui/RegisterScreen';
import { RoleNavigator } from '../navigation/RoleNavigator';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={RoleNavigator} />
      )}
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;