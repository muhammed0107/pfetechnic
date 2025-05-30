import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, List, Avatar, useTheme } from 'react-native-paper';
import { useTheme as useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { actualTheme } = useAppTheme();
  const { colors } = useTheme();
  const isDark = actualTheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    editButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: isDark ? '#4C1D95' : '#6D28D9',
      borderRadius: 20,
      padding: 8,
    },
    name: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: isDark ? '#fff' : '#333',
      marginBottom: 8,
    },
    email: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: isDark ? '#bbb' : '#666',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: isDark ? '#fff' : '#333',
      marginBottom: 16,
    },
    listItem: {
      backgroundColor: isDark
        ? 'rgba(34,34,34,0.95)'
        : 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      borderRadius: 12,
      marginBottom: 8,
    },
    listItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    listItemIcon: {
      marginRight: 16,
    },
    listItemText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: isDark ? '#fff' : '#333',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={120}
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={styles.avatar}
            />
            <View style={styles.editButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <List.Item
            title="Full Name"
            description="John Doe"
            left={(props) => <List.Icon {...props} icon="account" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Date of Birth"
            description="January 1, 1990"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Phone Number"
            description="+1 234 567 8900"
            left={(props) => <List.Icon {...props} icon="phone" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          <List.Item
            title="Blood Type"
            description="O+"
            left={(props) => <List.Icon {...props} icon="water" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Allergies"
            description="None"
            left={(props) => <List.Icon {...props} icon="alert" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Medical Conditions"
            description="None"
            left={(props) => <List.Icon {...props} icon="medical-bag" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <List.Item
            title="Contact Name"
            description="Jane Doe"
            left={(props) => <List.Icon {...props} icon="account-multiple" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Relationship"
            description="Spouse"
            left={(props) => <List.Icon {...props} icon="heart" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
          <List.Item
            title="Phone Number"
            description="+1 234 567 8901"
            left={(props) => <List.Icon {...props} icon="phone" />}
            style={styles.listItem}
            titleStyle={{ color: isDark ? '#fff' : '#333' }}
            descriptionStyle={{ color: isDark ? '#bbb' : '#666' }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
