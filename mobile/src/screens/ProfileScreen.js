import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  List,
  Avatar
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import useAuthStore from '../store/authStore';
import useTodoStore from '../store/todoStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { todos, clearTodos } = useTodoStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            clearTodos();
          }
        }
      ]
    );
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not verified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text 
              size={80} 
              label={getInitials(user?.username)} 
              style={styles.avatar}
            />
            <Title style={styles.username}>{user?.username}</Title>
            <Paragraph style={styles.email}>{user?.email}</Paragraph>
            
            <View style={styles.verificationBadge}>
              <Ionicons 
                name={user?.email_verified ? "checkmark-circle" : "alert-circle"} 
                size={16} 
                color={user?.email_verified ? "#10b981" : "#f59e0b"} 
              />
              <Text style={[
                styles.verificationText,
                { color: user?.email_verified ? "#10b981" : "#f59e0b" }
              ]}>
                {user?.email_verified ? "Verified" : "Unverified"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Statistics</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{todos.length}</Text>
                <Text style={styles.statLabel}>Total Todos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {todos.reduce((sum, todo) => sum + parseFloat(todo.price || 0), 0).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Total Value</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Account Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Account Information</Title>
            
            <List.Item
              title="Username"
              description={user?.username}
              left={() => <List.Icon icon="account" />}
            />
            
            <List.Item
              title="Email"
              description={user?.email}
              left={() => <List.Icon icon="email" />}
            />
            
            <List.Item
              title="Email Verification"
              description={user?.email_verified ? "Verified" : "Not verified"}
              left={() => <List.Icon 
                icon={user?.email_verified ? "check-circle" : "alert-circle"} 
              />}
            />
            
            {user?.email_verified_at && (
              <List.Item
                title="Verified On"
                description={formatDate(user.email_verified_at)}
                left={() => <List.Icon icon="calendar" />}
              />
            )}
          </Card.Content>
        </Card>

        {/* App Information */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>App Information</Title>
            
            <List.Item
              title="Version"
              description="1.0.0"
              left={() => <List.Icon icon="information" />}
            />
            
            <List.Item
              title="Platform"
              description="React Native"
              left={() => <List.Icon icon="cellphone" />}
            />
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor="#ef4444"
              icon="logout"
            >
              Logout
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
  },
  verificationText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  logoutCard: {
    marginBottom: 32,
    elevation: 2,
    borderRadius: 12,
  },
  logoutButton: {
    paddingVertical: 8,
    borderRadius: 8,
  },
});