import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';

export default function OnboardingScreen({ onGetStarted }) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 items-center justify-center">
        <Animated.View style={{ transform: [{ translateY }] }}>
          <LinearGradient
            colors={['#4338CA', '#4338CA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              shadowColor: '#4338CA',
              shadowOpacity: 0.4,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 6,
            }}
          >
            <Ionicons name="body" size={76} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Text className="text-4xl font-extrabold text-black text-center mb-2">Welcome</Text>
        <Text className="text-lg font-semibold text-neutral-400 text-center mb-4">
          Your Health, Simplified
        </Text>
        <Text className="text-neutral-500 text-center leading-6 mb-6">
          Two quick checks, one app — track your Body Mass Index and Waist-to-Hip Ratio to see
          what your numbers really mean.
        </Text>

        <View className="flex-row mb-12" style={{ gap: 10 }}>
          <View
            className="flex-row items-center px-3.5 py-1.5 rounded-full"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <Ionicons name="body-outline" size={14} color="#6366F1" />
            <Text className="text-xs font-bold ml-1.5" style={{ color: '#6366F1' }}>
              BMI
            </Text>
          </View>
          <View
            className="flex-row items-center px-3.5 py-1.5 rounded-full"
            style={{ backgroundColor: '#F0FDFA' }}
          >
            <Ionicons name="resize-outline" size={14} color="#0D9488" />
            <Text className="text-xs font-bold ml-1.5" style={{ color: '#0D9488' }}>
              WHR
            </Text>
          </View>
        </View>

        <View className="w-full">
          <PrimaryButton label="Get Started" onPress={onGetStarted} colors={['#4338CA', '#4338CA']} />
        </View>
      </View>
    </SafeAreaView>
  );
}
