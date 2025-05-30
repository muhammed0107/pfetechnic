// PlanForm.tsx  —  نسخة كاملة مع زرّ X يغلق الفورم
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,         // ⬅️ NEW
} from 'react-native';
import Slider from '@react-native-community/slider';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { XCircle } from 'lucide-react-native';   // ⬅️ NEW

export interface FormState {
  sex: string;
  age: string;
  height: string;
  weight: string;
  bmi: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'weight_loss' | 'muscle_gain' | 'endurance';
  days: string;
  hypertension: 'Yes' | 'No';
  diabetes: 'Yes' | 'No';
}

interface PlanFormProps {
  values: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSubmit: () => void;
  onClose: () => void;    // ⬅️ NEW
}

export default function PlanForm({
  values,
  onChange,
  onSubmit,
  onClose,               // ⬅️ NEW
}: PlanFormProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [errors, setErrors] =
    useState<Partial<Record<keyof FormState, string>>>({});

  /* ---------- BMI auto-calc ---------- */
  useEffect(() => {
    if (values.height && values.weight) {
      const h = parseFloat(values.height) / 100;
      const w = parseFloat(values.weight);
      if (h > 0 && w > 0) {
        onChange('bmi', (w / (h * h)).toFixed(1));
      }
    }
  }, [values.height, values.weight]);

  /* ---------- validation ---------- */
  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!values.age || isNaN(+values.age) || +values.age <= 0) newErrors.age = 'Enter a valid age';
    if (!values.height || isNaN(+values.height) || +values.height <= 0) newErrors.height = 'Enter a valid height';
    if (!values.weight || isNaN(+values.weight) || +values.weight <= 0) newErrors.weight = 'Enter a valid weight';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit();
  };

  /* ---------- UI ---------- */
  return (
    <ScrollView style={styles.container}>
      {/* Close button ― top-right */}
      <View style={styles.closeRow}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <XCircle size={26} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
        Basic Information
      </Text>

      {/* Gender */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldItem}>
          <Text style={[styles.label, { color: isDark ? '#ddd' : '#555' }]}>Gender</Text>
          <View style={styles.buttonGroup}>
            {['Male', 'Female'].map((g) => (
              <Button
                key={g}
                title={g}
                onPress={() => onChange('sex', g.toLowerCase())}
                type={values.sex === g.toLowerCase() ? 'primary' : 'outline'}
                style={styles.genderButton}
                textStyle={{ fontSize: 14 }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Age / Height */}
      <View style={styles.fieldRow}>
        <Input
          label="Age"
          value={values.age}
          onChangeText={(t) => onChange('age', t)}
          keyboardType="numeric"
          error={errors.age}
          style={styles.fieldItem}
        />
        <Input
          label="Height (cm)"
          value={values.height}
          onChangeText={(t) => onChange('height', t)}
          keyboardType="numeric"
          error={errors.height}
          style={styles.fieldItem}
        />
      </View>

      {/* Weight / BMI */}
      <View style={styles.fieldRow}>
        <Input
          label="Weight (kg)"
          value={values.weight}
          onChangeText={(t) => onChange('weight', t)}
          keyboardType="numeric"
          error={errors.weight}
          style={styles.fieldItem}
        />
        <View style={styles.fieldItem}>
          <Text style={[styles.label, { color: isDark ? '#ddd' : '#555' }]}>BMI</Text>
          <View
            style={[
              styles.bmiContainer,
              { backgroundColor: isDark ? '#222' : '#f5f5f5', borderColor: isDark ? '#444' : '#ddd' },
            ]}
          >
            <Text style={[styles.bmiText, { color: isDark ? '#fff' : '#333' }]}>
              {values.bmi || '--'}
            </Text>
          </View>
        </View>
      </View>

      {/* Goals */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333', marginTop: 20 }]}>
        Fitness Goals
      </Text>

      <Text style={[styles.label, { color: isDark ? '#ddd' : '#555', marginBottom: 8 }]}>
        Experience Level
      </Text>
      <View style={styles.buttonGroup}>
        {['beginner', 'intermediate', 'advanced'].map((level) => (
          <Button
            key={level}
            title={level[0].toUpperCase() + level.slice(1)}
            onPress={() => onChange('level', level as FormState['level'])}
            type={values.level === level ? 'primary' : 'outline'}
            style={styles.goalButton}
            textStyle={{ fontSize: 14 }}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: isDark ? '#ddd' : '#555', marginTop: 16, marginBottom: 8 }]}>
        Primary Goal
      </Text>
      <View style={styles.buttonGroup}>
        {['weight_loss', 'muscle_gain', 'endurance'].map((goal) => (
          <Button
            key={goal}
            title={goal.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            onPress={() => onChange('goal', goal as FormState['goal'])}
            type={values.goal === goal ? 'primary' : 'outline'}
            style={styles.goalButton}
            textStyle={{ fontSize: 14 }}
          />
        ))}
      </View>

      {/* Days per week slider */}
      <Text style={[styles.label, { color: isDark ? '#ddd' : '#555', marginTop: 16, marginBottom: 8 }]}>
        Days per week: {values.days}
      </Text>
      <Slider
        value={+values.days}
        minimumValue={3}
        maximumValue={7}
        step={1}
        minimumTrackTintColor="#4C1D95"
        maximumTrackTintColor={isDark ? '#444' : '#ddd'}
        thumbTintColor="#4C1D95"
        onValueChange={(v) => onChange('days', String(v))}
        style={styles.slider}
      />

      {/* Health conditions */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333', marginTop: 20 }]}>
        Health Conditions
      </Text>

      <View style={styles.fieldRow}>
        {/* Hypertension */}
        <View style={styles.fieldItem}>
          <Text style={[styles.label, { color: isDark ? '#ddd' : '#555' }]}>Hypertension</Text>
          <View style={styles.buttonGroup}>
            {['Yes', 'No'].map((o) => (
              <Button
                key={o}
                title={o}
                onPress={() => onChange('hypertension', o as 'Yes' | 'No')}
                type={values.hypertension === o ? 'primary' : 'outline'}
                style={styles.conditionButton}
                textStyle={{ fontSize: 14 }}
              />
            ))}
          </View>
        </View>

        {/* Diabetes */}
        <View style={styles.fieldItem}>
          <Text style={[styles.label, { color: isDark ? '#ddd' : '#555' }]}>Diabetes</Text>
          <View style={styles.buttonGroup}>
            {['Yes', 'No'].map((o) => (
              <Button
                key={o}
                title={o}
                onPress={() => onChange('diabetes', o as 'Yes' | 'No')}
                type={values.diabetes === o ? 'primary' : 'outline'}
                style={styles.conditionButton}
                textStyle={{ fontSize: 14 }}
              />
            ))}
          </View>
        </View>
      </View>

      <Button
        title="Generate Workout Plan"
        onPress={handleSubmit}
        fullWidth
        style={styles.submitButton}
      />
    </ScrollView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  closeRow: { alignItems: 'flex-end', marginBottom: 8 },   // ⬅️ NEW
  closeButton: { padding: 4 },                             // ⬅️ NEW
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', marginBottom: 16 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  fieldItem: { flex: 1, marginHorizontal: 4 },
  label: { fontSize: 14, fontFamily: 'Inter-Medium', marginBottom: 6 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  genderButton: { flex: 1, marginHorizontal: 4 },
  goalButton: { flex: 1, marginHorizontal: 4 },
  conditionButton: { flex: 1, marginHorizontal: 4 },
  bmiContainer: { height: 44, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  bmiText: { fontSize: 16, fontFamily: 'Inter-SemiBold' },
  slider: { height: 40, marginBottom: 16 },
  submitButton: { marginTop: 24, marginBottom: 40 },
});
