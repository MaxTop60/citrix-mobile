import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DriverCommandsScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Панель водителя</Text>
      <Text style={styles.subtitle}>Команды</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
});

export default DriverCommandsScreen;