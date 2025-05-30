import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  style,
}: InputProps) {
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: isDark ? '#ddd' : '#333' },
          ]}
        >
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#222' : '#f5f5f5',
            borderColor: error ? '#DC2626' : isDark ? '#444' : '#ddd',
          },
          multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
            },
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#888' : '#aaa'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidePassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setHidePassword(!hidePassword)}
          >
            {hidePassword ? (
              <Eye size={20} color={isDark ? '#888' : '#aaa'} />
            ) : (
              <EyeOff size={20} color={isDark ? '#888' : '#aaa'} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  multilineContainer: {
    minHeight: 100,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  eyeButton: {
    padding: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    marginLeft: 6,
    color: '#DC2626',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});