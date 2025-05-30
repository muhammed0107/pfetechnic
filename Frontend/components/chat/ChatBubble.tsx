import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const isUser = role === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? [
                styles.userBubble,
                { backgroundColor: isDark ? '#4C1D95' : '#8B5CF6' },
              ]
            : [
                styles.assistantBubble,
                { backgroundColor: isDark ? '#222' : '#f5f5f5' },
              ],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isUser ? '#fff' : isDark ? '#fff' : '#333' },
          ]}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
});