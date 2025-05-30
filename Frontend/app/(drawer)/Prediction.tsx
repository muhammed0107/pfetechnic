// PredictionsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Text as RNText,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, TextInput, Surface } from 'react-native-paper';
import {
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Ruler,
  Scale,
  ClipboardList,
  Stethoscope,
  TrendingUp,
  Info,
  CircleAlert as AlertCircle,
} from 'lucide-react-native';
import { useTheme as useAppTheme } from '@/context/ThemeContext';
import Header from '@/components/ui/Header';
import { predictDiabetes, predictBloodPressure } from '@/services/health';

interface PredictionResult {
  prediction: string;
  probability?: number;
  recommendations?: string[];
}

export default function PredictionsScreen() {
  const { actualTheme } = useAppTheme();
  const isDark = actualTheme === 'dark';

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'diabetes' | 'bp'>('diabetes');
  const [result, setResult] = useState<PredictionResult | null>(null);

  const [diabetesForm, setDiabetesForm] = useState({
    pregnancies: '',
    glucose: '',
    blood_pressure: '',
    skin_thickness: '',
    insulin: '',
    bmi: '',
    diabetes_pedigree: '',
    age: '',
  });
  const [bpForm, setBpForm] = useState({
    age: '',
    systolic_pressure: '',
    diastolic_pressure: '',
  });

  const handlePredict = async () => {
    setLoading(true);
    try {
      let res: PredictionResult;
      if (activeTab === 'diabetes') {
        res = await predictDiabetes({
          pregnancies: parseInt(diabetesForm.pregnancies),
          glucose: parseInt(diabetesForm.glucose),
          blood_pressure: parseInt(diabetesForm.blood_pressure),
          skin_thickness: parseInt(diabetesForm.skin_thickness),
          insulin: parseInt(diabetesForm.insulin),
          bmi: parseFloat(diabetesForm.bmi),
          diabetes_pedigree: parseFloat(diabetesForm.diabetes_pedigree),
          age: parseInt(diabetesForm.age),
        });
      } else {
        res = await predictBloodPressure({
          age: parseInt(bpForm.age),
          systolic_pressure: parseInt(bpForm.systolic_pressure),
          diastolic_pressure: parseInt(bpForm.diastolic_pressure),
        });
      }
      setResult(res);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111' : '#f5f5f5' },
      ]}
    >
      <Header title="Health AI Predictions" />

      <Image
        source={{
          uri: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
        }}
        style={styles.backgroundImage}
        blurRadius={20}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.85)'
              : 'rgba(255,255,255,0.9)',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === 'diabetes'
                    ? isDark
                      ? '#4C1D95'
                      : '#6D28D9'
                    : 'transparent',
                borderColor: isDark ? '#4C1D95' : '#6D28D9',
              },
            ]}
            onPress={() => {
              setActiveTab('diabetes');
              setResult(null);
            }}
          >
            <Activity
              size={20}
              color={
                activeTab === 'diabetes' ? '#fff' : isDark ? '#fff' : '#6D28D9'
              }
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'diabetes'
                      ? '#fff'
                      : isDark
                      ? '#fff'
                      : '#6D28D9',
                },
              ]}
            >
              Diabetes Risk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === 'bp'
                    ? isDark
                      ? '#4C1D95'
                      : '#6D28D9'
                    : 'transparent',
                borderColor: isDark ? '#4C1D95' : '#6D28D9',
              },
            ]}
            onPress={() => {
              setActiveTab('bp');
              setResult(null);
            }}
          >
            <Heart
              size={20}
              color={activeTab === 'bp' ? '#fff' : isDark ? '#fff' : '#6D28D9'}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'bp' ? '#fff' : isDark ? '#fff' : '#6D28D9',
                },
              ]}
            >
              Blood Pressure
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <Surface
          style={[
            styles.formCard,
            {
              backgroundColor: isDark
                ? 'rgba(34,34,34,0.95)'
                : 'rgba(255,255,255,0.95)',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
          ]}
          elevation={2}
        >
          <View style={styles.formHeader}>
            <Text
              style={[styles.formTitle, { color: isDark ? '#fff' : '#333' }]}
            >
              {activeTab === 'diabetes'
                ? 'Diabetes Risk Assessment'
                : 'Blood Pressure Analysis'}
            </Text>
            <Info size={20} color={isDark ? '#fff' : '#333'} />
          </View>

          {activeTab === 'diabetes' ? (
            <View style={styles.grid}>
              {[
                { key: 'age', label: 'Age', Icon: Activity },
                { key: 'pregnancies', label: 'Pregnancies', Icon: Activity },
                { key: 'glucose', label: 'Glucose', Icon: Droplet },
                { key: 'blood_pressure', label: 'BP', Icon: Thermometer },
                { key: 'skin_thickness', label: 'Skin Thk', Icon: Ruler },
                { key: 'insulin', label: 'Insulin', Icon: Droplet },
                { key: 'bmi', label: 'BMI', Icon: Scale },
                {
                  key: 'diabetes_pedigree',
                  label: 'Pedigree',
                  Icon: ClipboardList,
                },
              ].map(({ key, label, Icon }) => (
                <View key={key} style={styles.inputContainer}>
                  <Icon
                    size={20}
                    color={isDark ? '#fff' : '#333'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    label={label}
                    value={(diabetesForm as any)[key]}
                    onChangeText={(val) =>
                      setDiabetesForm((p) => ({ ...p, [key]: val }))
                    }
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    textColor={isDark ? '#fff' : '#333'}
                    placeholderTextColor={isDark ? '#bbb' : '#666'}
                    outlineColor={
                      isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                    }
                    activeOutlineColor="#6D28D9"
                    theme={{
                      colors: {
                        primary: '#6D28D9',
                        background: 'transparent',
                        text: isDark ? '#fff' : '#333',
                        placeholder: isDark ? '#bbb' : '#666',
                      },
                    }}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.grid}>
              {[
                { key: 'age', label: 'Age', Icon: Activity },
                {
                  key: 'systolic_pressure',
                  label: 'Systolic',
                  Icon: Stethoscope,
                },
                {
                  key: 'diastolic_pressure',
                  label: 'Diastolic',
                  Icon: Stethoscope,
                },
              ].map(({ key, label, Icon }) => (
                <View key={key} style={styles.inputContainer}>
                  <Icon
                    size={20}
                    color={isDark ? '#fff' : '#333'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    label={label}
                    value={(bpForm as any)[key]}
                    onChangeText={(val) =>
                      setBpForm((p) => ({ ...p, [key]: val }))
                    }
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    textColor={isDark ? '#fff' : '#333'}
                    placeholderTextColor={isDark ? '#bbb' : '#666'}
                    outlineColor={
                      isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
                    }
                    activeOutlineColor="#6D28D9"
                    theme={{
                      colors: {
                        primary: '#6D28D9',
                        background: 'transparent',
                        text: isDark ? '#fff' : '#333',
                        placeholder: isDark ? '#bbb' : '#666',
                      },
                    }}
                  />
                </View>
              ))}
            </View>
          )}

          <Button
            mode="contained"
            onPress={handlePredict}
            loading={loading}
            disabled={loading}
            icon={TrendingUp}
            style={[
              styles.predictButton,
              { backgroundColor: isDark ? '#4C1D95' : '#6D28D9' },
            ]}
            contentStyle={styles.buttonContent}
          >
            Get Prediction
          </Button>
        </Surface>

        {/* Result */}
        {result && (
          <Surface
            style={[
              styles.resultCard,
              {
                backgroundColor: isDark
                  ? 'rgba(34,34,34,0.95)'
                  : 'rgba(255,255,255,0.95)',
                borderColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
              },
            ]}
            elevation={2}
          >
            <View style={styles.resultHeader}>
              <Text
                style={[
                  styles.resultTitle,
                  { color: isDark ? '#fff' : '#333' },
                ]}
              >
                Prediction Results
              </Text>
              <TrendingUp size={20} color={isDark ? '#fff' : '#333'} />
            </View>
            <View style={styles.resultContent}>
              <View
                style={[
                  styles.resultIcon,
                  {
                    backgroundColor: result.prediction
                      .toLowerCase()
                      .includes('not')
                      ? '#10B981'
                      : '#DC2626',
                  },
                ]}
              >
                <AlertCircle size={32} color="#fff" />
              </View>
              <Text
                style={[
                  styles.prediction,
                  {
                    color: result.prediction.toLowerCase().includes('not')
                      ? '#10B981'
                      : '#DC2626',
                  },
                ]}
              >
                {result.prediction}
              </Text>
              {result.probability != null && (
                <Text
                  style={[
                    styles.probability,
                    { color: isDark ? '#bbb' : '#666' },
                  ]}
                >
                  Confidence: {(result.probability * 100).toFixed(1)}%
                </Text>
              )}
            </View>
            {result.recommendations && (
              <View style={styles.recommendationsContainer}>
                <Text
                  style={[
                    styles.recommendationsTitle,
                    { color: isDark ? '#fff' : '#333' },
                  ]}
                >
                  Recommendations:
                </Text>
                {result.recommendations.map((rec, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.recommendation,
                      { color: isDark ? '#bbb' : '#666' },
                    ]}
                  >
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
          </Surface>
        )}
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <TrendingUp size={48} color="#6D28D9" />
          <ActivityIndicator
            size="large"
            color="#6D28D9"
            style={styles.loadingSpinner}
          />
          <RNText style={styles.loadingText}>Analyzing your data…</RNText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
  content: { padding: 16, paddingBottom: 32 },
  tabs: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tabText: { fontSize: 14, fontFamily: 'Inter-SemiBold' },

  formCard: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formTitle: { fontSize: 20, fontFamily: 'Inter-SemiBold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inputContainer: { width: '48%', position: 'relative' },
  inputIcon: { position: 'absolute', top: 14, left: 12 },
  input: { backgroundColor: 'transparent', paddingLeft: 40, marginBottom: 12 },
  predictButton: { marginTop: 8, borderRadius: 12 },
  buttonContent: { paddingVertical: 8 },

  resultCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginTop: 16 },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resultTitle: { fontSize: 20, fontFamily: 'Inter-SemiBold' },
  resultContent: { alignItems: 'center', marginBottom: 20 },
  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  prediction: { fontSize: 24, fontFamily: 'Inter-Bold', textAlign: 'center' },
  probability: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  recommendationsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  recommendation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 8,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: { marginTop: 12 },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
});
