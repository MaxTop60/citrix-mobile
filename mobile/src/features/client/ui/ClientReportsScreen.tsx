import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchReports } from '../model/clientSlice';

const ClientReportsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, isLoading } = useSelector((state: RootState) => state.client);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    await dispatch(fetchReports());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const handleDownload = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Ошибка', 'Не удалось открыть файл');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось открыть файл');
    }
  };

  const renderReport = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleDownload(item.fileUrl)}>
      <Text style={styles.reportIcon}>📄</Text>
      <View style={styles.reportInfo}>
        <Text style={styles.reportDate}>
          {new Date(item.generatedAt).toLocaleString()}
        </Text>
        <Text style={styles.reportFormat}>{item.format}</Text>
        {item.sentToEmail && (
          <Text style={styles.reportEmail}>Отправлен на: {item.sentToEmail}</Text>
        )}
      </View>
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
    <FlatList
      data={reports}
      keyExtractor={(item) => item.reportId}
      renderItem={renderReport}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>Нет отчётов</Text>
        </View>
      }
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportDate: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  reportFormat: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  reportEmail: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
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

export default ClientReportsScreen;