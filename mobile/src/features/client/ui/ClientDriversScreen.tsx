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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { apiClient } from '../../../shared/api/client';

interface Driver {
  driverId: string;
  fullName: string;
  phone: string;
  vehicleId: string | null;
  isActive: boolean;
}

interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  model: string;
}

const ClientDriversScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        apiClient.get('/drivers'),
        apiClient.get('/vehicles'),
      ]);
      setDrivers(driversRes.data);
      setVehicles(vehiclesRes.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const openAssignModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setSelectedVehicleId(driver.vehicleId || '');
    setModalVisible(true);
  };

  const handleAssign = async () => {
    if (!selectedDriver || !selectedVehicleId) {
      Alert.alert('Ошибка', 'Выберите транспорт');
      return;
    }

    try {
      await apiClient.put(`/drivers/${selectedDriver.driverId}/assign-vehicle?vehicleId=${selectedVehicleId}`);
      Alert.alert('Успех', 'Водитель привязан к транспорту');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Ошибка', error.response?.data || 'Не удалось привязать');
    }
  };

  const handleUnassign = async (driver: Driver) => {
    Alert.alert(
      'Отвязать',
      `Отвязать водителя ${driver.fullName} от транспорта?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отвязать',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/drivers/${driver.driverId}/unassign-vehicle`);
              Alert.alert('Успех', 'Водитель отвязан от транспорта');
              loadData();
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отвязать');
            }
          },
        },
      ]
    );
  };

  const getVehiclePlate = (vehicleId: string | null) => {
    if (!vehicleId) return '— не привязан —';
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? `${vehicle.plateNumber} (${vehicle.model})` : '— транспорт не найден —';
  };

  const renderDriver = ({ item }: { item: Driver }) => (
    <View style={styles.card}>
      <Text style={styles.driverName}>{item.fullName}</Text>
      <Text style={styles.driverPhone}>{item.phone}</Text>
      <Text style={styles.vehicleInfo}>ТС: {getVehiclePlate(item.vehicleId)}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.assignButton} onPress={() => openAssignModal(item)}>
          <Text style={styles.assignButtonText}>✏️ Привязать ТС</Text>
        </TouchableOpacity>
        {item.vehicleId && (
          <TouchableOpacity style={styles.unassignButton} onPress={() => handleUnassign(item)}>
            <Text style={styles.unassignButtonText}>🔗 Отвязать</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.driverId}
        renderItem={renderDriver}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Нет водителей</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Привязать ТС к {selectedDriver?.fullName}
            </Text>
            <FlatList
              data={vehicles}
              keyExtractor={(item) => item.vehicleId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.vehicleOption,
                    selectedVehicleId === item.vehicleId && styles.vehicleOptionSelected,
                  ]}
                  onPress={() => setSelectedVehicleId(item.vehicleId)}
                >
                  <Text style={styles.vehiclePlate}>{item.plateNumber}</Text>
                  <Text style={styles.vehicleModel}>{item.model}</Text>
                </TouchableOpacity>
              )}
              style={styles.vehicleList}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAssign}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16 },
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
  driverName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  driverPhone: { fontSize: 14, color: '#666', marginBottom: 4 },
  vehicleInfo: { fontSize: 12, color: '#007AFF', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  assignButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  unassignButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  unassignButtonText: { color: '#DC3545', fontSize: 12, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#999', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  vehicleList: { maxHeight: 300, marginBottom: 16 },
  vehicleOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  vehicleOptionSelected: { backgroundColor: '#e8f0fe' },
  vehiclePlate: { fontSize: 16, fontWeight: '500' },
  vehicleModel: { fontSize: 12, color: '#666' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
  cancelButtonText: { color: '#666' },
  saveButton: { flex: 1, padding: 12, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ClientDriversScreen;