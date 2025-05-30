import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
    age: '',
    height: '',
    weight: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<any>({});

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const errors: any = {};
    
    if (!formData.fullName) {
      errors.fullName = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (validate()) {
      const userData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined,
      };
      
      delete userData.confirmPassword;
      await signup(userData);
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
          Create Account
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: isDark ? '#bbb' : '#666' },
          ]}
        >
          Sign up to start your health journey
        </Text>
        
        <View style={[styles.form, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)' }]}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChangeText={(text) => updateForm('fullName', text)}
            autoCapitalize="words"
            error={validationErrors.fullName}
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => updateForm('email', text)}
            keyboardType="email-address"
            error={validationErrors.email}
          />
          
          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text) => updateForm('password', text)}
            secureTextEntry
            error={validationErrors.password}
          />
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateForm('confirmPassword', text)}
            secureTextEntry
            error={validationErrors.confirmPassword}
          />
          
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#fff' : '#333' },
            ]}
          >
            Optional Health Information
          </Text>
          
          <View style={styles.genderContainer}>
            <Text
              style={[
                styles.label,
                { color: isDark ? '#ddd' : '#555' },
              ]}
            >
              Gender
            </Text>
            <View style={styles.genderButtons}>
              {['Male', 'Female'].map((gender) => (
                <Button
                  key={gender}
                  title={gender}
                  onPress={() => updateForm('gender', gender)}
                  type={formData.gender === gender ? 'primary' : 'outline'}
                  style={styles.genderButton}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.row}>
            <Input
              label="Age"
              placeholder="Age"
              value={formData.age}
              onChangeText={(text) => updateForm('age', text)}
              keyboardType="numeric"
              style={styles.halfInput}
            />
            
            <Input
              label="Height (cm)"
              placeholder="Height"
              value={formData.height}
              onChangeText={(text) => updateForm('height', text)}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
          
          <Input
            label="Weight (kg)"
            placeholder="Weight"
            value={formData.weight}
            onChangeText={(text) => updateForm('weight', text)}
            keyboardType="numeric"
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
            fullWidth
            style={styles.signupButton}
          />
          
          <View style={styles.loginContainer}>
            <Text
              style={[
                styles.loginText,
                { color: isDark ? '#bbb' : '#666' },
              ]}
            >
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Log In</Text>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  form: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 12,
  },
  genderContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  genderButtons: {
    flexDirection: 'row',
  },
  genderButton: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  errorText: {
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    marginBottom: 16,
  },
  signupButton: {
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4C1D95',
  },
});