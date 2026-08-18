import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

export default function PrimaryButton({ label, onPress, disabled, colors = ['#6366F1', '#8B5CF6'] }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, friction: 6 }).start();
  };
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={disabled}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {disabled ? (
          <Animated.View className="flex-row items-center justify-center rounded-2xl py-4 bg-neutral-200">
            <Text className="text-base font-bold text-neutral-400">{label}</Text>
          </Animated.View>
        ) : (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              paddingVertical: 16,
              shadowColor: colors[1],
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <Text className="text-base font-bold text-white">{label}</Text>
          </LinearGradient>
        )}
      </Animated.View>
    </Pressable>
  );
}
