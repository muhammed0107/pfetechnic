// PlanScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
} from 'react-native';
import { useAppStore } from '@/store';
import { useTheme } from '@/context/ThemeContext';
import {
  getWorkoutPlan,
  generateWorkoutPlan,
  saveWorkoutPlan,
} from '@/services/health';
import PlanForm, { FormState } from '@/components/plan/PlanForm';
import Button from '@/components/ui/Button';
import {
  Share2,
  Download,
  Plus,
  Dumbbell,
  Box,
  BookOpen,
  Coffee,
  XCircle,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { WorkoutPlan } from '@/types/workout';

export default function PlanScreen() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { user } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [formData, setFormData] = useState<FormState>({
    sex: 'male',
    age: '',
    height: '',
    weight: '',
    bmi: '',
    level: 'beginner',
    goal: 'muscle_gain',
    days: '5',
    hypertension: 'No',
    diabetes: 'No',
  });
  const [recModalVisible, setRecModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);

  const daysOfWeek = plan ? Object.keys(plan.weekly_plan) : [];

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      setShowForm(true);
      return;
    }
    getWorkoutPlan(user._id)
      .then((data) => {
        if (data.weekly_plan) {
          setPlan(data);
          setShowForm(false);
          const today = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
          });
          if (data.weekly_plan[today]) setSelectedDay(today);
        } else {
          setShowForm(true);
        }
      })
      .catch(() => setShowForm(true))
      .finally(() => setLoading(false));
  }, [user?._id]);

  const handleGenerate = async () => {
    if (!user?._id) return;
    setIsGenerating(true);
    try {
      const targetWeight =
        formData.goal === 'weight_loss'
          ? parseFloat(formData.weight) - 5
          : parseFloat(formData.weight) + 5;
      const payload = {
        sex: formData.sex,
        age: parseInt(formData.age, 10),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        level: formData.level,
        goal: formData.goal,
        days_per_week: parseInt(formData.days, 10),
        target_weight: targetWeight,
        hypertension: formData.hypertension,
        diabetes: formData.diabetes,
        userId: user._id,
      };
      const gen = await generateWorkoutPlan(payload);
      await saveWorkoutPlan(user._id, gen);
      setPlan(gen);
      setShowForm(false);
      Toast.show({ type: 'success', text1: 'Workout plan generated' });
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      setSelectedDay(
        gen.weekly_plan[today] ? today : Object.keys(gen.weekly_plan)[0]
      );
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to generate plan' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        size="large"
        color={isDark ? '#fff' : '#000'}
      />
    );
  }

  if (showForm) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#121212' : '#FFF' },
        ]}
      >
        <PlanForm
          values={formData}
          onChange={(k, v) => setFormData((prev) => ({ ...prev, [k]: v }))}
          onSubmit={handleGenerate}
          onClose={() => setShowForm(false)}
          disabled={isGenerating}
        />
        {isGenerating && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
          </View>
        )}
      </SafeAreaView>
    );
  }

  const exercises = plan?.weekly_plan[selectedDay] || [];
  const recText =
    typeof plan?.recommendation === 'string' ? plan.recommendation : '';
  const dietText = typeof plan?.diet === 'string' ? plan.diet : '';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#121212' : '#FAFAFA',
          paddingHorizontal: 16, // inset from left/right
        },
      ]}
    >
      {/* Header */}
      <View style={styles.topBar}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>
          My Workout Plan
        </Text>
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.generateText}>New Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Day Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          styles.tabBar,
          { backgroundColor: isDark ? '#1F1F1F' : '#EEE' },
        ]}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.tab,
              day === selectedDay && {
                borderBottomColor: '#4C1D95',
                borderBottomWidth: 3,
              },
            ]}
          >
            <Text style={[styles.tabText, { color: isDark ? '#FFF' : '#333' }]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercises List */}
      <FlatList
        data={exercises}
        keyExtractor={(item, i) => item.exercise + i}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
            ]}
          >
            <Dumbbell size={24} color="#4C1D95" style={styles.icon} />
            <View style={styles.textWrap}>
              <Text
                style={[styles.name, { color: isDark ? '#FFF' : '#333' }]}
                numberOfLines={1}
              >
                {item.exercise}
              </Text>
              <Text
                style={[styles.detail, { color: isDark ? '#AAA' : '#666' }]}
              >
                {item.sets} sets • {item.reps} reps{' '}
                {item.weight ? `• ${item.weight}kg` : ''}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      {/* Info Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.infoSection}
      >
        {/* Recommendation */}
        <TouchableOpacity
          style={[
            styles.infoCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
          ]}
          onPress={() => setRecModalVisible(true)}
          activeOpacity={0.8}
        >
          <BookOpen size={24} color="#4C1D95" style={styles.infoIcon} />
          <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#333' }]}>
            Recommendation
          </Text>
          <Text
            style={[styles.infoText, { color: isDark ? '#AAA' : '#666' }]}
            numberOfLines={1}
          >
            {recText}
          </Text>
        </TouchableOpacity>

        {/* Diet */}
        <TouchableOpacity
          style={[
            styles.infoCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
          ]}
          onPress={() => setDietModalVisible(true)}
          activeOpacity={0.8}
        >
          <Coffee size={24} color="#4C1D95" style={styles.infoIcon} />
          <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#333' }]}>
            Diet
          </Text>
          <Text
            style={[styles.infoText, { color: isDark ? '#AAA' : '#666' }]}
            numberOfLines={1}
          >
            {dietText}
          </Text>
        </TouchableOpacity>

        {/* Equipment */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
          ]}
        >
          <Box size={24} color="#4C1D95" style={styles.infoIcon} />
          <Text style={[styles.infoTitle, { color: isDark ? '#FFF' : '#333' }]}>
            Equipment
          </Text>
          <Text
            style={[styles.infoText, { color: isDark ? '#AAA' : '#666' }]}
            numberOfLines={1}
          >
            {plan?.equipment.join(', ')}
          </Text>
        </View>
      </ScrollView>

      {/* Recommendation Modal */}
      <Modal visible={recModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}
              >
                Recommendation
              </Text>
              <TouchableOpacity onPress={() => setRecModalVisible(false)}>
                <XCircle size={24} color={isDark ? '#FFF' : '#333'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text
                style={[styles.infoText, { color: isDark ? '#CCC' : '#666' }]}
              >
                {recText}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Diet Modal */}
      <Modal visible={dietModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}
              >
                Diet
              </Text>
              <TouchableOpacity onPress={() => setDietModalVisible(false)}>
                <XCircle size={24} color={isDark ? '#FFF' : '#333'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text
                style={[styles.infoText, { color: isDark ? '#CCC' : '#666' }]}
              >
                {dietText}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <Button
          icon={<Share2 size={18} />}
          title="Share"
          onPress={() => {
            /* share logic */
          }}
        />
        <Button
          icon={<Download size={18} />}
          title="PDF"
          onPress={() => {
            /* pdf logic */
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C1D95',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  generateText: {
    color: '#FFF',
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
  },

  tabBar: {
    paddingVertical: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  infoSection: {
    paddingVertical: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 200,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    maxHeight: '70%',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#444',
  },
});
