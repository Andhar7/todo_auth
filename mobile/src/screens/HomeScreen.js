import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Image
} from 'react-native';
import {
  Text,
  FAB,
  Card,
  IconButton,
  Title,
  Paragraph,
  Searchbar,
  Chip
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import useTodoStore from '../store/todoStore';
import useAuthStore from '../store/authStore';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { todos, loading, error, fetchTodos, deleteTodo } = useTodoStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    await fetchTodos();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const handleDeleteTodo = (todo) => {
    Alert.alert(
      'Delete Todo',
      `Are you sure you want to delete "${todo.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteTodo(todo.id);
            if (!result.success) {
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  const handleEditTodo = (todo) => {
    navigation.navigate('Create', { todo, isEditing: true });
  };

  const filteredTodos = todos.filter(todo =>
    todo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const renderTodoItem = ({ item }) => (
    <Card style={styles.todoCard} mode="outlined">
      <Card.Content>
        <View style={styles.todoHeader}>
          <View style={styles.todoInfo}>
            <Title style={styles.todoName}>{item.name}</Title>
            <View style={styles.priceContainer}>
              <Chip mode="outlined" compact>
                {formatPrice(item.price)}
              </Chip>
            </View>
          </View>
          <View style={styles.todoActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEditTodo(item)}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteTodo(item)}
              style={styles.actionButton}
              iconColor="#ef4444"
            />
          </View>
        </View>
        
        {/* Display image if it exists and is not placeholder */}
        {item.image && item.image !== 'https://via.placeholder.com/150' && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: item.image }}
              style={styles.todoImage}
              resizeMode="cover"
              onError={() => {
                console.log('Failed to load image:', item.image);
              }}
            />
          </View>
        )}
        
        <Paragraph style={styles.todoDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="clipboard-outline" size={64} color="#94a3b8" />
      <Text style={styles.emptyTitle}>No Todos Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by creating your first todo item!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.username}! 👋
        </Text>
        
        <Searchbar
          placeholder="Search todos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {error && (
        <Card style={styles.errorCard} mode="outlined">
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTodoItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  todoCard: {
    marginBottom: 12,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  todoInfo: {
    flex: 1,
  },
  todoName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  imageContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  todoImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  todoDate: {
    color: '#94a3b8',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366f1',
  },
});