import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Header from '@/components/ui/Header';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInputBar from '@/components/chat/ChatInputBar';
import ChatTypeSelector from '@/components/chat/ChatTypeSelector';
import { useTheme } from '@/context/ThemeContext';
import { sendAiMessage } from '@/services/health';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type ChatType = 'symptom' | 'food' | 'explore';

export default function ChatScreen() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatType, setChatType] = useState<ChatType>('symptom');
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let welcomeMessage = '';
    switch (chatType) {
      case 'symptom':
        welcomeMessage =
          "👋 Describe your symptoms, and I'll help you understand what might be going on.";
        break;
      case 'food':
        welcomeMessage =
          "🍎 Ask me about any food, and I'll provide nutritional info.";
        break;
      case 'explore':
        welcomeMessage = '🔍 Explore any medical condition with me!';
        break;
    }

    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: welcomeMessage,
      },
    ]);
  }, [chatType]);

  const validateInput = () => {
    if (!input.trim()) {
      Alert.alert('Empty Input', 'Please enter your question or description');
      return false;
    }

    // Validation spécifique pour les symptômes
    if (chatType === 'symptom' && input.trim().split(/\s+/).length < 3) {
      Alert.alert(
        'More Details Needed',
        'Please describe your symptoms with more details (at least 3 words)'
      );
      return false;
    }

    // Validation spécifique pour l'exploration
    if (chatType === 'explore' && input.length < 5) {
      Alert.alert(
        'More Details Needed',
        'Please provide a more specific query (at least 5 characters)'
      );
      return false;
    }

    return true;
  };

  const sendMessage = async () => {
    if (!validateInput()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Scroll après affichage du message utilisateur
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Créer un message de chargement
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: loadingMessageId, role: 'assistant', content: '...' },
    ]);

    try {
      const response = await sendAiMessage(
        user?._id || 'guest-user',
        chatType,
        userMessage.content
      );

      // Vérifier si la réponse est vide ou invalide
      if (!response?.response?.trim()) {
        throw new Error('Empty response from server');
      }

      const fullText = response.response;

      // Remplacer le message "..." par du texte vide avant l'animation
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId ? { ...msg, content: '' } : msg
        )
      );

      // Animation de frappe
      let index = 0;
      const typingInterval = setInterval(() => {
        index++;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId
              ? { ...msg, content: fullText.slice(0, index) }
              : msg
          )
        );

        if (index >= fullText.length) {
          clearInterval(typingInterval);
          setLoading(false);
        }
      }, 20);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      
      // Gestion d'erreur spécifique pour les symptômes
      if (chatType === 'symptom') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  content: '⚠️ Unable to analyze symptoms. Please try again with more details.',
                }
              : msg
          )
        );
      } 
      // Gestion d'erreur spécifique pour l'exploration
      else if (chatType === 'explore') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  content: '⚠️ Could not find information. Please try a different query.',
                }
              : msg
          )
        );
      } 
      // Gestion d'erreur générale
      else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessageId
              ? {
                  ...msg,
                  content: '❌ Sorry, something went wrong. Please try again.',
                }
              : msg
          )
        );
      }
      
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111' : '#f5f5f5' },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble role={item.role} content={item.content} />
          )}
          ListHeaderComponent={
            <ChatTypeSelector chatType={chatType} setChatType={setChatType} />
          }
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: loading ? 60 : 16 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4C1D95" size="small" />
            <Text
              style={[styles.loadingText, { color: isDark ? '#bbb' : '#666' }]}
            >
              AI is typing...
            </Text>
          </View>
        )}

        <ChatInputBar
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          placeholder={
            chatType === 'symptom'
              ? 'Describe your symptoms (min 3 words)...'
              : chatType === 'food'
              ? 'Ask about a food...'
              : 'Ask about any health topic (min 5 chars)...'
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});