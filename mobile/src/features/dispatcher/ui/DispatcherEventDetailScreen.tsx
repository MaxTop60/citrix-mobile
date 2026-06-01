import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchEventById, updateEventStatus, sendCommand } from '../../events/model/eventsSlice';

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

const getStatusText = (status: string): string => {
  switch (status) {
    case 'NEW':
      return 'Новое';
    case 'IN_PROGRESS':
      return 'В обработке';
    case 'CLOSED':
      return 'Закрыто';
    default:
      return status;
  }
};

const DispatcherEventDetailScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { currentEvent, isLoading } = useSelector((state: RootState) => state.events);
  const [commandMessage, setCommandMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [eventId]);

  const handleStatusUpdate = async (status: string) => {
    await dispatch(updateEventStatus({ eventId, status }));
    Alert.alert('Успех', `Статус изменён на ${getStatusText(status)}`);
  };

  const handleSendCommand = async () => {
    if (!commandMessage.trim()) {
      Alert.alert('Ошибка', 'Введите текст команды');
      return;
    }

    setSending(true);
    try {
      // TODO: заменить driverId на реальный ID водителя
      const driverId = 'd4a5e6f7-8b9c-0d1e-2f3a-4b5c6d7e8f9a';
      await dispatch(sendCommand({
        eventId,
        message: commandMessage,
        channel: 'SMS',
        driverId,
      })).unwrap();
      Alert.alert('Успех', 'Команда отправлена водителю');
      setCommandMessage('');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось отправить команду');
    } finally {
      setSending(false);
    }
  };

  if (isLoading || !currentEvent) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(currentEvent.priority) }]}>
          <Text style={styles.priorityText}>{currentEvent.priority}</Text>
        </View>

        <Text style={styles.label}>Тип события</Text>
        <Text style={styles.value}>{currentEvent.eventType}</Text>

        <Text style={styles.label}>Статус</Text>
        <Text style={styles.value}>{getStatusText(currentEvent.status)}</Text>

        <Text style={styles.label}>Описание</Text>
        <Text style={styles.value}>{currentEvent.description}</Text>

        <Text style={styles.label}>Время</Text>
        <Text style={styles.value}>{new Date(currentEvent.timestamp).toLocaleString()}</Text>

        <Text style={styles.label}>Координаты</Text>
        <Text style={styles.value}>
          {currentEvent.latitude?.toFixed(6)}, {currentEvent.longitude?.toFixed(6)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Управление</Text>

        {currentEvent.status !== 'CLOSED' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => handleStatusUpdate('IN_PROGRESS')}
            >
              <Text style={styles.buttonText}>Взять в работу</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSuccess]}
              onPress={() => handleStatusUpdate('CLOSED')}
            >
              <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subsectionTitle}>Отправить команду водителю</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите текст команды..."
          value={commandMessage}
          onChangeText={setCommandMessage}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={[styles.button, styles.buttonSend, sending && styles.buttonDisabled]}
          onPress={handleSendCommand}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending ? 'Отправка...' : 'Отправить SMS'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 16,
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonPrimary: {
    backgroundColor: '#FF9500',
  },
  buttonSuccess: {
    backgroundColor: '#34C759',
  },
  buttonSend: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
});

export default DispatcherEventDetailScreen;