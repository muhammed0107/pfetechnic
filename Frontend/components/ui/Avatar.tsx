import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { getImageUrl } from '@/services/api';

interface Props {
  image?: string; // nom du fichier OU URL complète
  name?: string; // utilisé pour les initiales
  size?: number; // taille du carré
  placeholderColor?: string; // couleur de fond si pas d’image
}

export default function Avatar({
  image,
  name = '',
  size = 80,
  placeholderColor = '#e5e7eb',
}: Props) {
  const initials = name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  const uri = image ? getImageUrl(image) : undefined;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: placeholderColor,
        },
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
});
