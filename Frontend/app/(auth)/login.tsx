import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<any>({});

  const validate = () => {
    const errors: any = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      await login(email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={{ uri: 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg' }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={20}
      />
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' }]} />
      
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg' }}
            style={styles.logo}
          />
          <ThemeToggle />
        </View>
        
        <Text
          style={[
            styles.title,
            { color: isDark ? '#fff' : '#333' },
          ]}
        >
          Welcome Back
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? '#bbb' : '#666' },
          ]}
        >
          Log in to continue to your health journey
        </Text>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={validationErrors.email}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={validationErrors.password}
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPasswordContainer}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                { color: isDark ? '#bbb' : '#666' },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />
          
          <View style={styles.signupContainer}>
            <Text
              style={[
                styles.signupText,
                { color: isDark ? '#bbb' : '#666' },
              ]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4C1D95',
  },
});