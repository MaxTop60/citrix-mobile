import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle, Vehicle } from '../model/clientSlice';

const ClientVehiclesScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, isLoading } = useSelector((state: RootState) => state.client);
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    vehicleType: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    await dispatch(fetchVehicles());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicles();
    setRefreshing(false);
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({ plateNumber: '', model: '', vehicleType: '' });
    setModalVisible(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plateNumber: vehicle.plateNumber,
      model: vehicle.model || '',
      vehicleType: vehicle.vehicleType || '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.plateNumber) {
      Alert.alert('Ошибка', 'Введите госномер');
      return;
    }

    setSubmitting(true);
    try {
      if (editingVehicle) {
        await dispatch(updateVehicle({
          vehicleId: editingVehicle.vehicleId,
          vehicle: formData,
        })).unwrap();
        Alert.alert('Успех', 'ТС обновлено');
      } else {
        // TODO: заменить clientId на реальный ID клиента
        const clientId = '6e8bb18b-9709-4838-8720-c0e7f878b895';
        await dispatch(createVehicle({
          vehicle: formData,
          clientId,
        })).unwrap();
        Alert.alert('Успех', 'ТС добавлено');
      }
      setModalVisible(false);
      await loadVehicles();
    } catch (error: any) {
      Alert.alert('Ошибка', error.message || 'Не удалось сохранить ТС');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert(
      'Удаление',
      `Удалить ТС ${vehicle.plateNumber}?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteVehicle(vehicle.vehicleId)).unwrap();
              Alert.alert('Успех', 'ТС удалено');
              await loadVehicles();
            } catch (error: any) {
              Alert.alert('Ошибка', error.message || 'Не удалось удалить ТС');
            }
          },
        },
      ]
    );
  };

  const renderVehicle = ({ item }: { item: Vehicle }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.plateNumber}>{item.plateNumber}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editButton}>
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.model}>{item.model || 'Модель не указана'}</Text>
      {item.vehicleType && (
        <Text style={styles.vehicleType}>Тип: {item.vehicleType}</Text>
      )}
      {item.currentSpeed !== undefined && (
        <Text style={styles.speed}>Скорость: {item.currentSpeed} км/ч</Text>
      )}
    </View>
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
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicleId}
        renderItem={renderVehicle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Нет транспортных средств</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Модальное окно */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingVehicle ? 'Редактировать ТС' : 'Добавить ТС'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Госномер *"
              value={formData.plateNumber}
              onChangeText={(text) => setFormData({ ...formData, plateNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Модель"
              value={formData.model}
              onChangeText={(text) => setFormData({ ...formData, model: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Тип (грузовой, легковой и т.д.)"
              value={formData.vehicleType}
              onChangeText={(text) => setFormData({ ...formData, vehicleType: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Сохранение...' : 'Сохранить'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  model: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  vehicleType: {
    fontSize: 12,
    color: '#999',
  },
  speed: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ClientVehiclesScreen;