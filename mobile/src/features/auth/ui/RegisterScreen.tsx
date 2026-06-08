import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,  
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { register, clearError } from '../model/authSlice';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchClients } from '../../../shared/api/client'

type Role = 'ROLE_CLIENT' | 'ROLE_DISPATCHER' | 'ROLE_DRIVER';

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('ROLE_DISPATCHER');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [clients, setClients] = useState<any[]>([]);
  const [showClientPicker, setShowClientPicker] = useState(false);

 useEffect(() => {
    if (error) {
      Alert.alert('Ошибка', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    loadClients();  
  }, []);

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients', error);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName || !phone) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
      return;
    }

    const result = await dispatch(register({ 
      email, 
      password, 
      role: selectedRole,
      fullName,
      phone,
      clientId: selectedClientId || undefined,
    }));
    
    if (register.fulfilled.match(result)) {
      navigation.replace('Main');
    }
  };

  const getRoleDescription = (role: Role): string => {
    switch (role) {
      case 'ROLE_CLIENT':
        return 'Управление автопарком, отчёты';
      case 'ROLE_DISPATCHER':
        return 'Обработка событий, отправка команд';
      case 'ROLE_DRIVER':
        return 'Просмотр и подтверждение команд';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>Регистрация</Text>
          <Text style={styles.subtitle}>Выберите тип аккаунта</Text>

          {/* Выбор роли */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'ROLE_CLIENT' && styles.roleOptionSelected,
              ]}
              onPress={() => setSelectedRole('ROLE_CLIENT')}
            >
              <Text style={[
                styles.roleTitle,
                selectedRole === 'ROLE_CLIENT' && styles.roleTitleSelected,
              ]}>Клиент</Text>
              <Text style={styles.roleDescription}>Управление автопарком</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'ROLE_DISPATCHER' && styles.roleOptionSelected,
              ]}
              onPress={() => setSelectedRole('ROLE_DISPATCHER')}
            >
              <Text style={[
                styles.roleTitle,
                selectedRole === 'ROLE_DISPATCHER' && styles.roleTitleSelected,
              ]}>Диспетчер</Text>
              <Text style={styles.roleDescription}>Обработка событий</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'ROLE_DRIVER' && styles.roleOptionSelected,
              ]}
              onPress={() => setSelectedRole('ROLE_DRIVER')}
            >
              <Text style={[
                styles.roleTitle,
                selectedRole === 'ROLE_DRIVER' && styles.roleTitleSelected,
              ]}>Водитель</Text>
              <Text style={styles.roleDescription}>Подтверждение команд</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedRoleText}>
            Выбрано: {getRoleDescription(selectedRole)}
          </Text>

          {(selectedRole === 'ROLE_DISPATCHER' || selectedRole === 'ROLE_DRIVER') && (
            <View style={styles.clientSection}>
              <Text style={styles.clientLabel}>Выберите автопарк (клиента)</Text>
              <TouchableOpacity 
                style={styles.clientPicker}
                onPress={() => setShowClientPicker(true)}
              >
                <Text>
                  {selectedClientId 
                    ? clients.find(c => c.clientId === selectedClientId)?.name || 'Выберите клиента'
                    : '— Выберите автопарк —'}
                </Text>
              </TouchableOpacity>
              
              {/* Модальное окно с выбором клиента */}
              <Modal visible={showClientPicker} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Выберите автопарк</Text>
                    <FlatList
                      data={clients}
                      keyExtractor={(item) => item.clientId}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.clientOption}
                          onPress={() => {
                            setSelectedClientId(item.clientId);
                            setShowClientPicker(false);
                          }}
                        >
                          <Text style={styles.clientName}>{item.name}</Text>
                          <Text style={styles.clientInn}>ИНН: {item.inn}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity onPress={() => setShowClientPicker(false)}>
                      <Text style={styles.closeButton}>Закрыть</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View> 
          )}

          <Input
            label="ФИО"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Иванов Иван Иванович"
          />

          <Input
            label="Телефон"
            value={phone}
            onChangeText={setPhone}
            placeholder="+7 (999) 123-45-67"
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="example@mail.ru"
          />

          <Input
            label="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Input
            label="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <Button
            title="Зарегистрироваться"
            onPress={handleRegister}
            loading={isLoading}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginText}>
              Уже есть аккаунт? <Text style={styles.loginLinkText}>Войдите</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  roleOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  roleOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f0fe',
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  roleTitleSelected: {
    color: '#007AFF',
  },
  roleDescription: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  selectedRoleText: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLinkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  clientSection: {
    marginBottom: 20,
  },
  clientLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  clientPicker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'center',
  },
  clientPickerText: {
    fontSize: 16,
    color: '#333',
  },
  clientPickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  clientOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  clientInn: {
    fontSize: 12,
    color: '#999',
  },
  closeButton: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    paddingVertical: 12,
  },
});

export default RegisterScreen;