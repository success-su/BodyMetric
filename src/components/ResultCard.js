import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import CircularGauge from './CircularGauge';

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ResultCard({
  title,
  value,
  category,
  footnote,
  unit,
  min,
  max,
  thresholds,
  onReset,
}) {
  const enter = useRef(new Animated.Value(0)).current;
  const bump = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Animated.spring(enter, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 60,
    }).start();
  }, []);

  useEffect(() => {
    if (prevValue.current !== value && prevValue.current !== undefined) {
      Animated.sequence([
        Animated.timing(bump, {
          toValue: 1.12,
          duration: 120,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(bump, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 120,
        }),
      ]).start();
    }
    prevValue.current = value;
  }, [value]);

  const pulse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(bump, {
        toValue: 1.08,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(bump, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }),
    ]).start();
  };

  if (value === null) {
    return (
      <View className="bg-neutral-50 rounded-2xl p-8 items-center border border-neutral-200 border-dashed">
        <Text className="text-neutral-400 text-center">
          Enter your details above to see your result
        </Text>
      </View>
    );
  }

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <Animated.View style={{ opacity: enter, transform: [{ scale }] }} className="items-center">
      <Animated.View
        className="rounded-2xl px-5 py-2.5 mb-6 flex-row items-baseline"
        style={{
          backgroundColor: category.color,
          shadowColor: category.color,
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          transform: [{ scale: bump }],
        }}
      >
        <Text className="text-white text-base font-semibold">{title} = </Text>
        <Text className="text-white text-base font-bold">
          {value}
          {unit ? ` ${unit}` : ''}
        </Text>
      </Animated.View>

      <Pressable onPress={pulse} hitSlop={12}>
        <CircularGauge value={parseFloat(value)} min={min} max={max} color={category.color} thresholds={thresholds}>
          <Animated.Text
            className="text-4xl font-extrabold text-black"
            style={{ transform: [{ scale: bump }] }}
          >
            {value}
          </Animated.Text>
          <Text className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mt-1">
            {category.label}
          </Text>
        </CircularGauge>
      </Pressable>

      {onReset ? (
        <Pressable
          onPress={onReset}
          className="flex-row items-center mt-6"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="font-semibold text-base mr-1.5" style={{ color: category.color }}>
            Calculate Again
          </Text>
          <Ionicons name="refresh" size={16} color={category.color} />
        </Pressable>
      ) : null}

      {footnote ? (
        <View
          className="mt-6 w-full rounded-2xl p-5"
          style={{ backgroundColor: hexToRgba(category.color, 0.08) }}
        >
          <Text
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: category.color }}
          >
            Good to know
          </Text>
          <Text className="text-sm text-neutral-500 leading-5">{footnote}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}
