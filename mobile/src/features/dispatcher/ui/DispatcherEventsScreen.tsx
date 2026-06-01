import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DispatcherEventsScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Панель диспетчера</Text>
      <Text style={styles.subtitle}>События</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
});

export default DispatcherEventsScreen;