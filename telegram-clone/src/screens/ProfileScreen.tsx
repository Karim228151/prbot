import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.field}>Name: {currentUser?.displayName ?? '—'}</Text>
      <Text style={styles.field}>Email: {currentUser?.email ?? '—'}</Text>
      <TouchableOpacity style={styles.button} onPress={() => logout().catch((e) => Alert.alert('Logout failed', e?.message ?? ''))}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  field: { fontSize: 16 },
  button: { marginTop: 16, backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default ProfileScreen;