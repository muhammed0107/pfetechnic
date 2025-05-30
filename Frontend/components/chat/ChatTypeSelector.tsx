import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Brain, Apple, Pill } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

type ChatType = 'symptom' | 'food' | 'explore';

interface ChatTypeSelectorProps {
  chatType: ChatType;
  setChatType: (type: ChatType) => void;
}

export default function ChatTypeSelector({
  chatType,
  setChatType,
}: ChatTypeSelectorProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const types: { type: ChatType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'symptom',
      label: 'Symptoms',
      icon: <Pill size={20} color={isDark ? '#fff' : '#4C1D95'} />,
    },
    {
      type: 'food',
      label: 'Nutrition',
      icon: <Apple size={20} color={isDark ? '#fff' : '#4C1D95'} />,
    },
    {
      type: 'explore',
      label: 'Explore',
      icon: <Brain size={20} color={isDark ? '#fff' : '#4C1D95'} />,
    },
  ];

  return (
    <View style={styles.container}>
      {types.map((item) => (
        <TouchableOpacity
          key={item.type}
          style={[
            styles.typeButton,
            {
              backgroundColor:
                chatType === item.type
                  ? isDark
                    ? '#4C1D95'
                    : '#E9D5FF'
                  : isDark
                  ? '#222'
                  : '#f5f5f5',
              borderColor: chatType === item.type ? '#4C1D95' : isDark ? '#444' : '#ddd',
            },
          ]}
          onPress={() => setChatType(item.type)}
        >
          {item.icon}
          <Text
            style={[
              styles.typeText,
              {
                color:
                  chatType === item.type
                    ? isDark
                      ? '#fff'
                      : '#4C1D95'
                    : isDark
                    ? '#bbb'
                    : '#666',
                fontFamily: chatType === item.type ? 'Inter-SemiBold' : 'Inter-Regular',
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  typeText: {
    fontSize: 13,
    marginLeft: 6,
  },
});