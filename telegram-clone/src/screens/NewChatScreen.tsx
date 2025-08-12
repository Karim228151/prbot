import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation';

export type NewChatScreenProps = NativeStackScreenProps<AppStackParamList, 'NewChat'>;

const NewChatScreen: React.FC<NewChatScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a chat name');
      return;
    }
    try {
      setIsSubmitting(true);
      const docRef = await addDoc(collection(db, 'threads'), {
        name: name.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        latestMessage: '',
      });
      navigation.replace('Chat', { threadId: docRef.id, threadName: name.trim() });
    } catch (e: any) {
      Alert.alert('Failed to create chat', e?.message ?? 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
      <Text style={styles.title}>New chat</Text>
      <TextInput style={styles.input} placeholder="Chat name" value={name} onChangeText={setName} />
      <TouchableOpacity style={[styles.button, isSubmitting && { opacity: 0.7 }]} onPress={onCreate} disabled={isSubmitting}>
        <Text style={styles.buttonText}>{isSubmitting ? 'Creating…' : 'Create'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, alignItems: 'stretch', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  button: { backgroundColor: '#2a84ff', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});

export default NewChatScreen;