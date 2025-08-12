import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation';
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export type ChatScreenProps = NativeStackScreenProps<AppStackParamList, 'Chat'>;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { threadId, threadName } = route.params;
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: threadName });
  }, [navigation, threadName]);

  useEffect(() => {
    const messagesQuery = query(
      collection(db, 'threads', threadId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(messagesQuery, (snap) => {
      const list: IMessage[] = snap.docs.map((d) => ({
        _id: d.id,
        text: String(d.get('text') ?? ''),
        createdAt: d.get('createdAt')?.toDate?.() ?? new Date(),
        user: {
          _id: String(d.get('userId') ?? 'system'),
          name: String(d.get('userName') ?? 'Unknown'),
        },
      }));
      setMessages(list);
    }, (err) => console.error(err));

    return unsub;
  }, [threadId]);

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    try {
      const m = newMessages[0];
      await addDoc(collection(db, 'threads', threadId, 'messages'), {
        text: m.text,
        createdAt: serverTimestamp(),
        userId: currentUser?.uid ?? 'unknown',
        userName: currentUser?.displayName ?? currentUser?.email ?? 'Unknown',
      });
      await updateDoc(doc(db, 'threads', threadId), {
        latestMessage: m.text,
        updatedAt: serverTimestamp(),
      });
    } catch (e: any) {
      Alert.alert('Send failed', e?.message ?? 'Unknown error');
    }
  }, [threadId, currentUser]);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{ _id: currentUser?.uid ?? 'unknown', name: currentUser?.displayName ?? currentUser?.email ?? 'You' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ChatScreen;