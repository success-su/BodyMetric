import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

const GENDER_STYLES = {
  female: {
    icon: 'woman',
    label: 'Female',
    gradientFrom: '#F472B6',
    gradientTo: '#EC4899',
    tint: '#FDF2F8',
    border: '#FBCFE8',
  },
  male: {
    icon: 'man',
    label: 'Male',
    gradientFrom: '#60A5FA',
    gradientTo: '#3B82F6',
    tint: '#EFF6FF',
    border: '#BFDBFE',
  },
};

function GenderCard({ config, selected, onPress }) {
  const scale = useRef(new Animated.Value(selected ? 1 : 0.96)).current;
  const iconScale = useRef(new Animated.Value(selected ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1 : 0.96,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
    Animated.spring(iconScale, {
      toValue: selected ? 1.15 : 1,
      useNativeDriver: true,
      friction: 5,
      tension: 90,
    }).start();
  }, [selected]);

  return (
    <Pressable
      onPress={onPress}
      className="flex-1"
      style={{ marginHorizontal: 6 }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: selected ? config.gradientTo : config.tint,
          borderColor: selected ? config.gradientTo : config.border,
          borderWidth: 2,
          borderRadius: 20,
          paddingVertical: 20,
          alignItems: 'center',
          shadowColor: config.gradientTo,
          shadowOpacity: selected ? 0.35 : 0,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: selected ? 4 : 0,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: iconScale }],
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: selected ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Ionicons
            name={config.icon}
            size={30}
            color={selected ? '#FFFFFF' : config.gradientTo}
          />
        </Animated.View>
        <Text
          className="font-bold text-base"
          style={{ color: selected ? '#FFFFFF' : '#404040' }}
        >
          {config.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function GenderToggle({ value, onChange }) {
  const handleChange = (next) => {
    if (next !== value) Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View className="flex-row" style={{ marginHorizontal: -6 }}>
      <GenderCard
        config={GENDER_STYLES.female}
        selected={value === 'female'}
        onPress={() => handleChange('female')}
      />
      <GenderCard
        config={GENDER_STYLES.male}
        selected={value === 'male'}
        onPress={() => handleChange('male')}
      />
    </View>
  );
}
