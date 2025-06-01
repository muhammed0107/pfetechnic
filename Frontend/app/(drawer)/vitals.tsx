import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Heart, Thermometer } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/ui/Header';

export default function VitalsScreen() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const [heartRate, setHeartRate] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [status, setStatus] = useState('🔄 Connexion...');

  const WEBSOCKET_URL = 'ws://192.168.17.167:81'; // IP de ton ESP32
  const BACKEND_URL = 'http://192.168.1.100:5000/api/vitals'; // ⬅️ remplace par ton backend

  // WebSocket pour lecture en temps réel
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => setStatus('✅ Connecté à l’ESP32');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.temperature !== undefined && data.bpm !== undefined) {
          setTemperature(data.temperature);
          setHeartRate(data.bpm);

          if (data.temperature > 1000 || data.bpm > 10000 || data.bpm < -6) {
            ToastAndroid.show('⚠️ Valeurs hors normes !', ToastAndroid.SHORT);
          }
        }
      } catch (err) {
        console.error('Erreur WebSocket :', err);
      }
    };

    socket.onerror = () => setStatus('❌ Erreur WebSocket');
    socket.onclose = () => setStatus('🔌 Déconnecté');

    return () => socket.close();
  }, []);

  // Envoi vers MongoDB toutes les 2 heures
  useEffect(() => {
    const interval = setInterval(() => {
      if (temperature > 0 && heartRate > 0) {
        fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            temperature,
            bpm: heartRate,
            timestamp: new Date().toISOString(),
          }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('✅ Données envoyées à MongoDB', data);
          })
          .catch(err => {
            console.error('❌ Erreur envoi MongoDB', err);
          });
      }
    }, 1000 * 60 * 60 * 2); // Toutes les 2 heures

    return () => clearInterval(interval);
  }, [temperature, heartRate]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#111' : '#f5f5f5' }]}>
      <Header title="Vital Signs" subtitle={status} />

      <View style={styles.content}>
        {/* CARD BPM */}
        <Surface style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <Heart size={24} color="#FF6B6B" />
            <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#333' }]}>Heart Rate</Text>
          </View>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#333' }]}>{heartRate}</Text>
          <Text style={[styles.unit, { color: isDark ? '#bbb' : '#666' }]}>BPM</Text>
          <View style={styles.rangeContainer}>
            <Text style={[styles.rangeText, { color: isDark ? '#bbb' : '#666' }]}>Normal Range: 60-100 BPM</Text>
            <View style={styles.rangeBar}>
              <View
                style={[
                  styles.rangeFill,
                  {
                    width: `${Math.min(Math.max((heartRate - 60) / 0.4, 0), 100)}%`,
                    backgroundColor: heartRate > 100 || heartRate < 60 ? '#FF6B6B' : '#4CAF50',
                  },
                ]}
              />
            </View>
          </View>
        </Surface>

        {/* CARD TEMPÉRATURE */}
        <Surface style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <Thermometer size={24} color="#4C1D95" />
            <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#333' }]}>Body Temperature</Text>
          </View>
          <Text style={[styles.value, { color: isDark ? '#fff' : '#333' }]}>{temperature.toFixed(1)}</Text>
          <Text style={[styles.unit, { color: isDark ? '#bbb' : '#666' }]}>°C</Text>
          <View style={styles.rangeContainer}>
            <Text style={[styles.rangeText, { color: isDark ? '#bbb' : '#666' }]}>Normal Range: 36.1-37.2°C</Text>
            <View style={styles.rangeBar}>
              <View
                style={[
                  styles.rangeFill,
                  {
                    width: `${Math.min(Math.max((temperature - 36.1) / 0.011, 0), 100)}%`,
                    backgroundColor: temperature > 37.2 || temperature < 36.1 ? '#FF6B6B' : '#4CAF50',
                  },
                ]}
              />
            </View>
          </View>
        </Surface>

        <Text style={[styles.disclaimer, { color: isDark ? '#bbb' : '#666' }]}>
          Les valeurs affichées proviennent du bracelet connecté en temps réel.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  value: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 4,
  },
  rangeContainer: { marginTop: 16 },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  rangeBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rangeFill: {
    height: '100%',
    borderRadius: 4,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
