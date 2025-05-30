/* -------------------------------------------------------------------------- */
/*  screens/ProfileScreen.tsx                                                 */
/* -------------------------------------------------------------------------- */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Animatable from 'react-native-animatable';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useTheme } from '@/context/ThemeContext';
import { useAppStore } from '@/store';
import { getProfile, updateProfile, uploadProfileImage } from '@/services/auth';
import { getImageUrl } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import useRefresh from '@/hooks/useRefresh';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import {
  CircleUser as UserIcon,
  Cake as CakeIcon,
  Ruler,
  Weight,
  Mars,
  Venus,
  CreditCard as Edit3,
} from 'lucide-react-native';

/* Prevent splash from hiding until fonts are ready (mobile) */
if (Platform.OS !== 'web') SplashScreen.preventAutoHideAsync();

/* -------------------------------------------------------------------------- */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  /* ---------------- Fonts ---------------- */
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });
  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (Platform.OS !== 'web') SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  /* ------------- Stores & auth ---------- */
  const { updateUserData } = useAuth();
  const token = useAppStore((s) => s.token) as string;
  const setUserStore = useAppStore((s) => s.setUser);
  const currentUser = useAppStore((s) => s.user);

  /* ------------- Local state ------------ */
  const [user, setUser] = useState({
    fullName: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    birthday: '',
    profileImage: '',
  });
  const [formData, setFormData] = useState(user);
  const [modal, setModal] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isImgLoad, setImgLoad] = useState(false);
  const [showDate, setShowDate] = useState(false);

  /* ---------- Fetch profile (memo) ------ */
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getProfile(token);
      const u = res.user;

      const mapped = {
        fullName: u.fullName,
        gender: u.gender,
        age: u.age?.toString() ?? '',
        height: u.height?.toString() ?? '',
        weight: u.weight?.toString() ?? '',
        birthday: u.birthday,
        profileImage: u.profileImage, // filename only
      };
      setUser(mapped);
      setUserStore(u); // ← sync Zustand / Drawer
    } catch (err) {
      console.error('fetchProfile', err);
      Toast.show({ type: 'error', text1: 'Failed to load profile' });
    }
  }, [token, setUserStore]);

  /* first load + pull-to-refresh */
  const { refreshing, onRefresh } = useRefresh(fetchProfile);
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ------------- Helpers --------------- */
  const niceDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : '';

  /* ---------- Image picker ------------- */
  const handleImagePick = async () => {
    try {
      // 1️⃣ Request permission (iOS/Android)
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission required',
          text2:
            'Please allow access to your photos to update your profile picture.',
        });
        return;
      }

      // 2️⃣ Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // 3️⃣ Handle cancellation (old & new API)
      const cancelled = (result as any).cancelled || (result as any).canceled;
      if (cancelled) return;

      setImgLoad(true);

      // 4️⃣ Extract the selected asset
      const asset = (result as any).assets
        ? (result as any).assets[0]
        : { uri: (result as any).uri, fileName: '' };

      const uri = asset.uri as string;
      // derive filename
      const rawName = asset.fileName || uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(rawName);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
      const fileName = rawName.includes('.') ? rawName : `${rawName}.jpg`;

      // 5️⃣ Build FormData differently for web vs native
      const fd = new FormData();
      if (Platform.OS === 'web') {
        // fetch the blob from the URI
        const response = await fetch(uri);
        const blob = await response.blob();
        fd.append('profileImage', blob, fileName);
      } else {
        // native: use the expo asset URI directly
        fd.append('profileImage', {
          uri,
          name: fileName,
          type: mimeType,
        } as any);
      }

      // 6️⃣ Upload to server
      const res = await uploadProfileImage(token, fd);

      // 7️⃣ Update local state + store
      const newFileName = res.user.profileImage;
      setUser((prev) => ({ ...prev, profileImage: newFileName }));
      setUserStore({ ...currentUser, profileImage: newFileName });
      updateUserData({ profileImage: newFileName });

      Toast.show({ type: 'success', text1: 'Profile photo updated' });
    } catch (err: any) {
      console.error('Image pick error:', err);
      Toast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: err.message || 'Unknown error',
      });
    } finally {
      setImgLoad(false);
    }
  };

  /* ------------- Save edits ------------ */
  const handleSave = async () => {
    setSaving(true);
    try {
      const upd = await updateProfile(token, {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        birthday: formData.birthday,
      });
      const u = upd.user;
      setUser({
        fullName: u.fullName,
        gender: u.gender,
        age: u.age.toString(),
        height: u.height.toString(),
        weight: u.weight.toString(),
        birthday: u.birthday,
        profileImage: u.profileImage,
      });
      setUserStore(u);
      setModal(false);
      Toast.show({ type: 'success', text1: 'Profile updated' });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: e.message });
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded && !fontError) return null;

  /* --------------------- UI --------------------- */
  return (
    <View style={[styles.fill, { backgroundColor: isDark ? '#111' : '#fff' }]}>
      <LinearGradient
        colors={isDark ? ['#000', '#111'] : ['#fff', '#fff']}
        style={styles.bgGradient}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ------------ top card ------------- */}
        <Animatable.View
          animation="fadeInUp"
          duration={400}
          style={[
            styles.card,
            { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
          ]}
        >
          <TouchableOpacity onPress={handleImagePick} activeOpacity={0.85}>
            <Avatar
              size={120}
              image={getImageUrl(user.profileImage)}
              name={user.fullName}
              placeholderColor={isDark ? '#27272a' : '#e5e7eb'}
            />
            {isImgLoad && (
              <View style={styles.avatarOverlay} pointerEvents="none">
                <ActivityIndicator color="#fff" size="large" />
              </View>
            )}
            <View style={styles.cameraBadge} pointerEvents="none">
              <Edit3 size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <Animatable.Text
            animation="fadeIn"
            delay={150}
            style={[styles.nameText, { color: isDark ? '#fff' : '#1e293b' }]}
          >
            {user.fullName || 'Unnamed User'}
          </Animatable.Text>

          <Button
            title="Edit profile"
            onPress={() => {
              setFormData(user);
              setModal(true);
            }}
            type="outline"
            icon={<Edit3 size={18} color={isDark ? '#fff' : '#4C1D95'} />}
            style={styles.editBtn}
          />
        </Animatable.View>

        {/* ------------ stats card ----------- */}
        <Animatable.View
          animation="fadeInUp"
          delay={100}
          duration={400}
          style={[
            styles.statsCard,
            { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
          ]}
        >
          {[
            { label: 'Height', value: `${user.height || '--'} cm` },
            { label: 'Weight', value: `${user.weight || '--'} kg` },
            { label: 'Age', value: user.age || '--' },
          ].map((it, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? '#27272a' : '#e5e7eb' },
                  ]}
                />
              )}
              <View style={styles.statItem}>
                <Animatable.Text
                  animation="fadeIn"
                  delay={200 + i * 50}
                  style={[
                    styles.statValue,
                    { color: isDark ? '#fff' : '#1e293b' },
                  ]}
                >
                  {it.value}
                </Animatable.Text>
                <Animatable.Text
                  animation="fadeIn"
                  delay={300 + i * 50}
                  style={[
                    styles.statLabel,
                    { color: isDark ? '#a1a1aa' : '#64748b' },
                  ]}
                >
                  {it.label}
                </Animatable.Text>
              </View>
            </React.Fragment>
          ))}
        </Animatable.View>

        {/* ----------- personal info --------- */}
        <Animatable.View
          animation="fadeInUp"
          delay={200}
          duration={400}
          style={[
            styles.detailCard,
            { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
          ]}
        >
          <Animatable.Text
            animation="fadeIn"
            delay={250}
            style={[
              styles.sectionTitle,
              { color: isDark ? '#fff' : '#1e293b' },
            ]}
          >
            Personal information
          </Animatable.Text>

          {[
            {
              icon: UserIcon,
              label: 'Full name',
              value: user.fullName || '--',
            },
            {
              icon: user.gender === 'female' ? Venus : Mars,
              label: 'Gender',
              value: user.gender
                ? user.gender === 'male'
                  ? 'Male'
                  : 'Female'
                : '--',
            },
            {
              icon: CakeIcon,
              label: 'Birthday',
              value: niceDate(user.birthday) || '--',
            },
            {
              icon: Ruler,
              label: 'Height',
              value: user.height ? `${user.height} cm` : '--',
            },
            {
              icon: Weight,
              label: 'Weight',
              value: user.weight ? `${user.weight} kg` : '--',
            },
          ].map((it, i) => (
            <Animatable.View
              key={i}
              animation="fadeInUp"
              delay={300 + i * 50}
              style={[
                styles.detailItem,
                { backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6' },
              ]}
            >
              <it.icon size={20} color={isDark ? '#fff' : '#4C1D95'} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Animatable.Text
                  animation="fadeIn"
                  delay={350 + i * 50}
                  style={[
                    styles.detailLabel,
                    { color: isDark ? '#a1a1aa' : '#64748b' },
                  ]}
                >
                  {it.label}
                </Animatable.Text>
                <Animatable.Text
                  animation="fadeIn"
                  delay={400 + i * 50}
                  style={[
                    styles.detailValue,
                    { color: isDark ? '#fff' : '#1e293b' },
                  ]}
                >
                  {it.value}
                </Animatable.Text>
              </View>
            </Animatable.View>
          ))}
        </Animatable.View>
      </ScrollView>

      {/* ----------- edit modal ----------- */}
      {modal && (
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="fadeInUp"
            duration={300}
            style={[
              styles.modalContainer,
              { backgroundColor: isDark ? '#1f1f1f' : '#fff' },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  {
                    key: 'fullName',
                    placeholder: 'Full name',
                    keyboard: 'default',
                    icon: (
                      <UserIcon size={18} color={isDark ? '#fff' : '#4C1D95'} />
                    ),
                  },
                  {
                    key: 'age',
                    placeholder: 'Age',
                    keyboard: 'numeric',
                    icon: (
                      <CakeIcon size={18} color={isDark ? '#fff' : '#4C1D95'} />
                    ),
                  },
                  {
                    key: 'height',
                    placeholder: 'Height (cm)',
                    keyboard: 'numeric',
                    icon: (
                      <Ruler size={18} color={isDark ? '#fff' : '#4C1D95'} />
                    ),
                  },
                  {
                    key: 'weight',
                    placeholder: 'Weight (kg)',
                    keyboard: 'numeric',
                    icon: (
                      <Weight size={18} color={isDark ? '#fff' : '#4C1D95'} />
                    ),
                  },
                ].map((fld, idx) => (
                  <Animatable.View
                    key={fld.key}
                    animation="fadeInUp"
                    delay={idx * 70}
                    style={styles.inputWrapper}
                  >
                    <Input
                      label={fld.placeholder}
                      value={(formData as any)[fld.key] as string}
                      onChangeText={(txt) =>
                        setFormData((p) => ({ ...p, [fld.key]: txt }))
                      }
                      keyboardType={fld.keyboard as any}
                      leftIcon={fld.icon}
                    />
                  </Animatable.View>
                ))}

                {/* gender radio */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={350}
                  style={{ marginBottom: 16 }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    {['male', 'female'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.genderBtn,
                          formData.gender === g && styles.genderBtnSelected,
                        ]}
                        onPress={() =>
                          setFormData((p) => ({ ...p, gender: g }))
                        }
                      >
                        {g === 'male' ? (
                          <Mars
                            size={18}
                            color={formData.gender === g ? '#fff' : '#4C1D95'}
                          />
                        ) : (
                          <Venus
                            size={18}
                            color={formData.gender === g ? '#fff' : '#4C1D95'}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animatable.View>

                {/* birthday picker */}
                <Animatable.View
                  animation="fadeInUp"
                  delay={400}
                  style={styles.inputWrapper}
                >
                  <TouchableOpacity
                    style={[
                      styles.datePicker,
                      { borderColor: isDark ? '#333' : '#e5e7eb' },
                    ]}
                    onPress={() => setShowDate(true)}
                  >
                    <CakeIcon size={18} color={isDark ? '#fff' : '#4C1D95'} />
                    <Animatable.Text
                      animation="fadeIn"
                      delay={450}
                      style={[
                        styles.datePickerText,
                        { color: isDark ? '#fff' : '#1e293b' },
                      ]}
                    >
                      {formData.birthday
                        ? niceDate(formData.birthday)
                        : 'Select date'}
                    </Animatable.Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={showDate}
                    mode="date"
                    onConfirm={(date) => {
                      setShowDate(false);
                      setFormData((p) => ({
                        ...p,
                        birthday: date.toISOString(),
                      }));
                    }}
                    onCancel={() => setShowDate(false)}
                  />
                </Animatable.View>
              </ScrollView>

              {/* modal actions */}
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setModal(false)}
                  type="outline"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Save"
                  loading={isSaving}
                  onPress={handleSave}
                  style={{ flex: 1, marginLeft: 8 }}
                />
              </View>
            </KeyboardAvoidingView>
          </Animatable.View>
        </View>
      )}

      <Toast position="top" topOffset={insets.top + 50} />
    </View>
  );
}

/* -------------------------------- styles -------------------------------- */
const styles = StyleSheet.create({
  fill: { flex: 1 },
  bgGradient: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: 16 },

  card: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 28,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    }),
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 60,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4C1D95',
    padding: 6,
    borderRadius: 14,
  },
  nameText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginTop: 12,
    marginBottom: 8,
  },
  editBtn: { paddingHorizontal: 20 },

  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 22,
    borderRadius: 28,
    marginBottom: 16,
  },
  divider: { width: 1, opacity: 0.15 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontFamily: 'Inter-SemiBold' },
  statLabel: { fontSize: 14, fontFamily: 'Inter-Regular' },

  detailCard: { padding: 24, borderRadius: 28, gap: 12 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
  },
  detailLabel: { fontSize: 13, fontFamily: 'Inter-Regular' },
  detailValue: { fontSize: 16, fontFamily: 'Inter-SemiBold' },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    maxHeight: '85%',
    padding: 24,
    borderRadius: 28,
  },
  inputWrapper: { marginBottom: 16 },
  genderBtn: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#4C1D95',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  genderBtnSelected: { backgroundColor: '#4C1D95' },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  datePickerText: { marginLeft: 8, fontFamily: 'Inter-Regular' },
  modalActions: { flexDirection: 'row', marginTop: 16 },
});
