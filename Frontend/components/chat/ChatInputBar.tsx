import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface ChatInputBarProps {
  input: string;
  setInput: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export default function ChatInputBar({
  input,
  setInput,
  onSend,
  placeholder = 'Type a message...',
}: ChatInputBarProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const handleSend = () => {
    if (input.trim()) {
      onSend();
      Keyboard.dismiss();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111' : '#fff' },
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#222' : '#f5f5f5',
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: isDark ? '#fff' : '#000' },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: input.trim() ? '#4C1D95' : isDark ? '#333' : '#ddd',
            },
          ]}
          onPress={handleSend}
          disabled={!input.trim()}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});