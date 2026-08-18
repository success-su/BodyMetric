import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

export default function SegmentedToggle({ options, value, onChange, accentColor = '#111111' }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const handleChange = (next) => {
    if (next !== value) Haptics.selectionAsync();
    onChange(next);
  };
  const translateX = useRef(new Animated.Value(0)).current;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const segmentWidth = containerWidth / options.length;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: index * segmentWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 90,
    }).start();
  }, [index, segmentWidth]);

  return (
    <View
      className="flex-row bg-neutral-100 rounded-2xl p-1.5"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{ position: 'relative' }}
    >
      {containerWidth > 0 ? (
        <Animated.View
          style={{
            position: 'absolute',
            top: 6,
            bottom: 6,
            left: 6,
            width: segmentWidth - 6,
            borderRadius: 12,
            backgroundColor: accentColor,
            transform: [{ translateX }],
          }}
        />
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => handleChange(option.value)}
            className="flex-1 py-3 rounded-xl items-center"
            style={{ zIndex: 1 }}
          >
            <Text
              className={`text-sm font-semibold ${selected ? 'text-white' : 'text-neutral-500'}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
