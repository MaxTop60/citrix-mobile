import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

// Client экраны
import ClientDashboardScreen from '../features/client/ui/ClientDashboardScreen';
import ClientVehiclesScreen from '../features/client/ui/ClientVehiclesScreen';
import ClientReportsScreen from '../features/client/ui/ClientReportsScreen';

// Dispatcher экраны
import DispatcherEventsScreen from '../features/dispatcher/ui/DispatcherEventsScreen';
import DispatcherEventDetailScreen from '../features/dispatcher/ui/DispatcherEventDetailScreen';

// Driver экраны
import DriverCommandsScreen from '../features/driver/ui/DriverCommandsScreen';
import DriverCommandDetailScreen from '../features/driver/ui/DriverCommandDetailScreen';

const Stack = createStackNavigator();

const ClientStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={ClientDashboardScreen} options={{ title: 'Панель управления' }} />
    <Stack.Screen name="Vehicles" component={ClientVehiclesScreen} options={{ title: 'Транспорт' }} />
    <Stack.Screen name="Reports" component={ClientReportsScreen} options={{ title: 'Отчёты' }} />
  </Stack.Navigator>
);

const DispatcherStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Events" component={DispatcherEventsScreen} options={{ title: 'События' }} />
    <Stack.Screen name="EventDetail" component={DispatcherEventDetailScreen} options={{ title: 'Детали события' }} />
  </Stack.Navigator>
);

const DriverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Commands" component={DriverCommandsScreen} options={{ title: 'Мои команды' }} />
    <Stack.Screen name="CommandDetail" component={DriverCommandDetailScreen} options={{ title: 'Детали команды' }} />
  </Stack.Navigator>
);

export const RoleNavigator = () => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  switch (userRole) {
    case 'ROLE_CLIENT':
      return <ClientStack />;
    case 'ROLE_DRIVER':
      return <DriverStack />;
    default:
      return <DispatcherStack />;
  }
};