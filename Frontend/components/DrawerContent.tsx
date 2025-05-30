/* -------------------------------------------------------------------------- */
/*  components/navigation/DrawerContent.tsx                                   */
/* -------------------------------------------------------------------------- */
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { getImageUrl } from '@/services/api';

import {
  Home as HomeIcon,
  Activity,
  Dumbbell,
  HeartPulse,
  MessageSquare,
  LogOut,
  User,
} from 'lucide-react-native';

export function DrawerContent(props: any) {
  /* ---------------- global data ---------------- */
  const { actualTheme } = useTheme();
  const { logout } = useAuth();
  const { user, isLoading, refresh } = useProfile();

  /* -- fetch once per focus (stable fn, no deps) */
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  /* --------------- UI helpers ------------------ */
  const isDark = actualTheme === 'dark';
  const bg = isDark ? '#111' : '#fff';
  const cardBg = isDark ? '#1e1e1e' : '#f9f9f9';
  const textCol = isDark ? '#fff' : '#000';

  const profileImgUri = user?.profileImage
    ? getImageUrl(user.profileImage)
    : undefined;

  const drawerItems = [
    { label: 'Home', icon: HomeIcon, route: '(tabs)' },
    { label: 'Activity', icon: Activity, route: 'activity' },
    { label: 'Workout Plan', icon: Dumbbell, route: 'plan' },
    { label: 'Vitals', icon: HeartPulse, route: 'vitals' },
    { label: 'AI Chat', icon: MessageSquare, route: 'chat' },
    { label: 'Prediction', icon: HeartPulse, route: 'Prediction' },
  ];
  const currentRoute = props.state.routes[props.state.index].name;

  /* --------------- render ---------------------- */
  return (
    <DrawerContentScrollView
      {...props}
      style={[styles.container, { backgroundColor: bg }]}
    >
      {/* header */}
      <View style={[styles.header, { backgroundColor: cardBg }]}>
        <View style={styles.profileContainer}>
          {isLoading ? (
            <View style={[styles.profileImage, styles.loadingContainer]}>
              <ActivityIndicator color={textCol} />
            </View>
          ) : profileImgUri ? (
            <Image
              key={profileImgUri}
              source={{ uri: profileImgUri }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profilePlaceholder]}>
              <User size={60} color={textCol} />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: textCol }]}>
            {isLoading ? 'Loading...' : user?.fullName || 'User'}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#bbb' : '#666' }]}>
            {user?.email || ''}
          </Text>
        </View>
      </View>

      {/* links */}
      <View style={styles.drawerItems}>
        {drawerItems.map((item) => (
          <DrawerItem
            key={item.route}
            label={item.label}
            icon={({ color, size }) => <item.icon size={size} color={color} />}
            onPress={() => props.navigation.navigate(item.route)}
            activeBackgroundColor={isDark ? '#2a2a2a' : '#f0f0f0'}
            activeTintColor="#6D28D9"
            inactiveTintColor={textCol}
            style={[
              styles.drawerItem,
              currentRoute === item.route && styles.activeDrawerItem,
            ]}
          />
        ))}
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: cardBg }]}
          onPress={logout}
        >
          <LogOut size={20} color={textCol} />
          <Text style={[styles.logoutText, { color: textCol }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

/* ---------------- styles (inchangés) ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  profileContainer: { marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  profilePlaceholder: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { alignItems: 'center' },
  name: { fontSize: 20, fontFamily: 'Inter-SemiBold', marginBottom: 4 },
  email: { fontSize: 14, fontFamily: 'Inter-Regular' },
  drawerItems: { marginTop: 8 },
  drawerItem: { marginVertical: 4 },
  activeDrawerItem: { backgroundColor: 'rgba(109,40,217,0.1)' },
  footer: { marginTop: 'auto', padding: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: { marginLeft: 8, fontSize: 16, fontFamily: 'Inter-Medium' },
});
