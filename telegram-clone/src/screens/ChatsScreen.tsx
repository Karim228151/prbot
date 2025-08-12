import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export type ChatsScreenProps = NativeStackScreenProps<AppStackParamList, 'Chats'>;

export type Thread = {
  id: string;
  name: string;
  latestMessage?: string;
};

const ChatsScreen: React.FC<ChatsScreenProps> = ({ navigation }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const { logout } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
            <Text style={styles.headerLink}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.headerLink}>Profile</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => logout().catch((e) => Alert.alert('Logout failed', e?.message ?? ''))}>
          <Text style={[styles.headerLink, { color: '#d33' }]}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  useEffect(() => {
    const q = query(collection(db, 'threads'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const list: Thread[] = snap.docs.map((d) => ({
        id: d.id,
        name: String(d.get('name') ?? 'Chat'),
        latestMessage: d.get('latestMessage') ?? undefined,
      }));
      setThreads(list);
    }, (err) => {
      console.error(err);
    });
    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { threadId: item.id, threadName: item.name })}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {item.latestMessage ? <Text style={styles.itemSubtitle} numberOfLines={1}>{item.latestMessage}</Text> : null}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 24 }}>No chats yet</Text>}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { paddingHorizontal: 16, paddingVertical: 14 },
  itemTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  itemSubtitle: { color: '#666' },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 16 },
  headerLink: { color: '#2a84ff', fontWeight: '700' },
});

export default ChatsScreen;