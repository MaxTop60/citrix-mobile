import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/model/authSlice';
import { AppDispatch } from '../../../app/store';

const ClientVehiclesScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await dispatch(logout());
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Панель клиента</Text>
      <Text style={styles.subtitle}>Транспорт</Text>
      <Button title="Транспорт" onPress={() => navigation.navigate('Vehicles')} />
      <Button title="Отчёты" onPress={() => navigation.navigate('Reports')} />
      <Button title="Выйти" onPress={handleLogout} color="#DC3545" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
});

export default ClientVehiclesScreen;