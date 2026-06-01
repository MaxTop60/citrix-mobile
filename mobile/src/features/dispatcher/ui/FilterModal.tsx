import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { eventType: string | null; priority: string | null; status: string | null }) => void;
  currentFilters: { eventType: string | null; priority: string | null; status: string | null };
}

const EVENT_TYPES = [
  { value: 'FUEL_DROP', label: 'Падение топлива' },
  { value: 'SPEED_EXCEED', label: 'Превышение скорости' },
  { value: 'LONG_IDLE', label: 'Длительный простой' },
  { value: 'GEOZONE_IN', label: 'Въезд в геозону' },
  { value: 'GEOZONE_OUT', label: 'Выезд из геозоны' },
  { value: 'TEMPERATURE_ALERT', label: 'Температурная тревога' },
];

const PRIORITIES = [
  { value: 'CRITICAL', label: 'Критический', color: '#FF3B30' },
  { value: 'HIGH', label: 'Высокий', color: '#FF9500' },
  { value: 'MEDIUM', label: 'Средний', color: '#FFCC00' },
  { value: 'LOW', label: 'Низкий', color: '#34C759' },
];

const STATUSES = [
  { value: 'NEW', label: 'Новое' },
  { value: 'IN_PROGRESS', label: 'В обработке' },
  { value: 'CLOSED', label: 'Закрыто' },
];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [eventType, setEventType] = React.useState<string | null>(currentFilters.eventType);
  const [priority, setPriority] = React.useState<string | null>(currentFilters.priority);
  const [status, setStatus] = React.useState<string | null>(currentFilters.status);

  const handleApply = () => {
    onApply({ eventType, priority, status });
    onClose();
  };

  const handleReset = () => {
    setEventType(null);
    setPriority(null);
    setStatus(null);
    onApply({ eventType: null, priority: null, status: null });
    onClose();
  };

  const renderFilterSection = (title: string, options: any[], selected: string | null, onSelect: (value: string | null) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.option, !selected && styles.optionActive]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.optionText, !selected && styles.optionTextActive]}>Все</Text>
        </TouchableOpacity>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              selected === option.value && styles.optionActive,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                selected === option.value && styles.optionTextActive,
                option.color && { color: option.color },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Фильтры</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {renderFilterSection('Тип события', EVENT_TYPES, eventType, setEventType)}
            {renderFilterSection('Приоритет', PRIORITIES, priority, setPriority)}
            {renderFilterSection('Статус', STATUSES, status, setStatus)}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.buttonReset]} onPress={handleReset}>
              <Text style={styles.buttonResetText}>Сбросить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonApply]} onPress={handleApply}>
              <Text style={styles.buttonApplyText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    padding: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  optionActive: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonReset: {
    backgroundColor: '#f0f0f0',
  },
  buttonResetText: {
    color: '#666',
    fontWeight: '600',
  },
  buttonApply: {
    backgroundColor: '#007AFF',
  },
  buttonApplyText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterModal;