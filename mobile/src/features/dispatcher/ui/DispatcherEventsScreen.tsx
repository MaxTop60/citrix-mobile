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
import { fetchEvents, setFilter, resetFilters, applyFilters, Event } from '../../events/model/eventsSlice';
import { useNavigation } from '@react-navigation/native';
import FilterModal from './FilterModal';
import { logout } from '../../auth/model/authSlice';

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'CRITICAL':
      return '#FF3B30';
    case 'HIGH':
      return '#FF9500';
    case 'MEDIUM':
      return '#FFCC00';
    default:
      return '#34C759';
  }
};

const getPriorityText = (priority: string): string => {
  switch (priority) {
    case 'CRITICAL':
      return 'КРИТИЧЕСКИЙ';
    case 'HIGH':
      return 'ВЫСОКИЙ';
    case 'MEDIUM':
      return 'СРЕДНИЙ';
    default:
      return 'НИЗКИЙ';
  }
};

const getEventTypeText = (eventType: string): string => {
  switch (eventType) {
    case 'FUEL_DROP':
      return 'Падение топлива';
    case 'SPEED_EXCEED':
      return 'Превышение скорости';
    case 'LONG_IDLE':
      return 'Длительный простой';
    case 'GEOZONE_IN':
      return 'Въезд в геозону';
    case 'GEOZONE_OUT':
      return 'Выезд из геозоны';
    case 'TEMPERATURE_ALERT':
      return 'Температурная тревога';
    default:
      return eventType;
  }
};

const DispatcherEventsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredEvents, isLoading, error, filters } = useSelector((state: RootState) => state.events);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    await dispatch(fetchEvents());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleApplyFilters = (newFilters: { eventType: string | null; priority: string | null; status: string | null }) => {
    if (newFilters.eventType !== undefined) dispatch(setFilter({ type: 'eventType', value: newFilters.eventType }));
    if (newFilters.priority !== undefined) dispatch(setFilter({ type: 'priority', value: newFilters.priority }));
    if (newFilters.status !== undefined) dispatch(setFilter({ type: 'status', value: newFilters.status }));
    dispatch(applyFilters());
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
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

  const hasActiveFilters = filters.eventType || filters.priority || filters.status;

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.eventId })}
    >
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
        <Text style={styles.priorityText}>{getPriorityText(item.priority)}</Text>
      </View>
      <Text style={styles.eventType}>{getEventTypeText(item.eventType)}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.time}>
        {new Date(item.timestamp).toLocaleString()}
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
        <TouchableOpacity onPress={loadEvents}>
          <Text style={styles.retryText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Text style={[styles.filterButtonText, hasActiveFilters && styles.filterButtonTextActive]}>
              🔽 Фильтр {hasActiveFilters && '✓'}
            </Text>
          </TouchableOpacity>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
              <Text style={styles.resetButtonText}>Сбросить</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.eventId}
        renderItem={renderEvent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Нет событий</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
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
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#DC3545',
    fontWeight: '500',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    marginLeft: 12,
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
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
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
  errorText: {
    color: '#DC3545',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryText: {
    color: '#007AFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default DispatcherEventsScreen;