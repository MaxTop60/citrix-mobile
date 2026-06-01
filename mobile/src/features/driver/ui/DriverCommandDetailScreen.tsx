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
import { fetchCommandById, confirmCommand } from '../../events/model/eventsSlice';

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

const DriverCommandDetailScreen = ({ route, navigation }: any) => {
  const { commandId } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const { currentCommand, isLoading } = useSelector((state: RootState) => state.events);
  const [responseText, setResponseText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCommandById(commandId));
  }, [commandId]);

  const handleConfirm = async () => {
    if (!responseText.trim()) {
      Alert.alert('Ошибка', 'Введите текст подтверждения');
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(confirmCommand({
        commandId,
        responseType: 'TEXT_CONFIRMATION',
        content: responseText,
      })).unwrap();
      Alert.alert('Успех', 'Команда подтверждена');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось подтвердить команду');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !currentCommand) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const canConfirm = currentCommand.status !== 'RESPONDED' && currentCommand.status !== 'ERROR';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Статус</Text>
        <Text style={styles.value}>{getStatusText(currentCommand.status)}</Text>

        <Text style={styles.label}>Команда</Text>
        <Text style={styles.value}>{currentCommand.message}</Text>

        <Text style={styles.label}>Отправлено</Text>
        <Text style={styles.value}>{new Date(currentCommand.sentAt).toLocaleString()}</Text>

        {currentCommand.deliveredAt && (
          <>
            <Text style={styles.label}>Доставлено</Text>
            <Text style={styles.value}>{new Date(currentCommand.deliveredAt).toLocaleString()}</Text>
          </>
        )}

        {currentCommand.errorMessage && (
          <>
            <Text style={styles.label}>Ошибка</Text>
            <Text style={[styles.value, styles.errorText]}>{currentCommand.errorMessage}</Text>
          </>
        )}
      </View>

      {canConfirm && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Подтверждение выполнения</Text>
          <TextInput
            style={styles.input}
            placeholder="Опишите выполненные действия..."
            value={responseText}
            onChangeText={setResponseText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Отправка...' : 'Подтвердить выполнение'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  errorText: {
    color: '#DC3545',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverCommandDetailScreen;