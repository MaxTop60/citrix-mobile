import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchDriverCommands, DriverCommand } from '../../events/model/eventsSlice';
import { logout } from '../../auth/model/authSlice';

const getStatusText = (status: string): string => {
  switch (status) {
    case 'SENT':
      return 'Отправлено';
    case 'DELIVERED':
      return 'Доставлено';
    case 'READ':
      return 'Прочитано';
    case 'RESPONDED':
      return 'Подтверждено';
    case 'ERROR':
      return 'Ошибка';
    default:
      return status;
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'SENT':
      return '#FF9500';
    case 'DELIVERED':
      return '#007AFF';
    case 'READ':
      return '#34C759';
    case 'RESPONDED':
      return '#28A745';
    case 'ERROR':
      return '#DC3545';
    default:
      return '#666';
  }
};

const DriverCommandsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { commands, isLoading } = useSelector((state: RootState) => state.events);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    await dispatch(fetchDriverCommands());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommands();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  const renderCommand = ({ item }: { item: DriverCommand }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CommandDetail', { commandId: item.commandId })}
    >
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.time}>
        {new Date(item.sentAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={commands}
        keyExtractor={(item) => item.commandId}
        renderItem={renderCommand}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Нет команд</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#DC3545',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default DriverCommandsScreen;