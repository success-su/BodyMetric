import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenderToggle from '../components/GenderToggle';
import LabeledInput from '../components/LabeledInput';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import SegmentedToggle from '../components/SegmentedToggle';
import { bmiCategory, calculateBmi } from '../utils/bmi';
import { convertLength, convertWeight, roundTo } from '../utils/units';
import { usePersistedState } from '../utils/usePersistedState';

const ACCENT = '#6366F1';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WEIGHT_UNITS = [
  { label: 'kg', value: 'kg' },
  { label: 'lb', value: 'lb' },
];

const HEIGHT_UNITS = [
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
];

const DEFAULT_FORM = {
  gender: 'male',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  age: '',
};

const BASE_FOOTNOTE =
  'BMI is a screening tool, not a diagnosis. Consult a doctor for a full health assessment.';

export default function BMIScreen() {
  const [form, setForm] = usePersistedState('bmi-form', DEFAULT_FORM);
  const [showResult, setShowResult] = useState(false);
  const { gender, weight, weightUnit, height, heightUnit, age } = form;

  const bmi = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (Number.isNaN(w) || Number.isNaN(h)) return null;
    return calculateBmi(w, weightUnit, h, heightUnit);
  }, [weight, weightUnit, height, heightUnit]);

  const category = bmiCategory(bmi);
  const hasInput = weight !== '' || height !== '' || age !== '';

  const ageNote = useMemo(() => {
    const a = parseInt(age, 10);
    if (!age || Number.isNaN(a)) return null;
    if (a < 18) {
      return 'Under 18? BMI-for-age percentiles are more accurate — check with a pediatrician.';
    }
    if (a >= 65) {
      return 'For adults 65+, a slightly higher BMI is often still considered healthy.';
    }
    return null;
  }, [age]);

  const footnote = ageNote ? `${BASE_FOOTNOTE}\n\n${ageNote}` : BASE_FOOTNOTE;

  const setField = (patch) => setForm((f) => ({ ...f, ...patch }));

  const resetFields = () => setForm((f) => ({ ...f, weight: '', height: '', age: '' }));

  const changeWeightUnit = (nextUnit) => {
    setForm((f) => {
      const w = parseFloat(f.weight);
      const nextWeight =
        f.weight !== '' && !Number.isNaN(w)
          ? String(roundTo(convertWeight(w, f.weightUnit, nextUnit)))
          : f.weight;
      return { ...f, weightUnit: nextUnit, weight: nextWeight };
    });
  };

  const changeHeightUnit = (nextUnit) => {
    setForm((f) => {
      const h = parseFloat(f.height);
      const nextHeight =
        f.height !== '' && !Number.isNaN(h)
          ? String(roundTo(convertLength(h, f.heightUnit, nextUnit)))
          : f.height;
      return { ...f, heightUnit: nextUnit, height: nextHeight };
    });
  };

  const animateTo = (next) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowResult(next);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center">
              <View
                className="w-9 h-9 rounded-xl items-center justify-center mr-2.5"
                style={{ backgroundColor: '#EEF2FF' }}
              >
                <Ionicons name="analytics" size={18} color={ACCENT} />
              </View>
              <Text
                className="text-xs font-bold uppercase tracking-[3px]"
                style={{ color: ACCENT }}
              >
                Body Mass Index
              </Text>
            </View>
            {!showResult && hasInput ? (
              <Pressable
                onPress={resetFields}
                hitSlop={8}
                className="flex-row items-center"
              >
                <Ionicons name="refresh" size={14} color="#A3A3A3" />
                <Text className="text-xs font-semibold text-neutral-400 ml-1">Reset</Text>
              </Pressable>
            ) : null}
          </View>
          <Text className="text-4xl font-extrabold text-black mb-1">BMI Calculator</Text>
          <Text className="text-neutral-500 mb-6">
            Select your gender, then enter your weight, height and age to see your BMI.
          </Text>

          {showResult ? (
            <ResultCard
              title="BMI"
              value={bmi !== null ? bmi.toFixed(1) : null}
              category={category}
              unit="kg/m²"
              min={15}
              max={35}
              thresholds={[
                { value: 18.5, color: '#22C55E' },
                { value: 25, color: '#F59E0B' },
                { value: 30, color: '#EF4444' },
              ]}
              footnote={footnote}
              onReset={() => animateTo(false)}
            />
          ) : (
            <>
              <View className="mb-5">
                <GenderToggle value={gender} onChange={(g) => setField({ gender: g })} />
              </View>

              <View className="mb-4">
                <SegmentedToggle
                  options={WEIGHT_UNITS}
                  value={weightUnit}
                  onChange={changeWeightUnit}
                  accentColor={ACCENT}
                />
              </View>
              <LabeledInput
                label="Weight"
                value={weight}
                onChangeText={(v) => setField({ weight: v })}
                unit={weightUnit}
                placeholder={weightUnit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
              />

              <View className="mb-4">
                <SegmentedToggle
                  options={HEIGHT_UNITS}
                  value={heightUnit}
                  onChange={changeHeightUnit}
                  accentColor={ACCENT}
                />
              </View>
              <LabeledInput
                label="Height"
                value={height}
                onChangeText={(v) => setField({ height: v })}
                unit={heightUnit}
                placeholder={heightUnit === 'cm' ? 'e.g. 175' : 'e.g. 69'}
              />

              <LabeledInput
                label="Age"
                value={age}
                onChangeText={(v) => setField({ age: v })}
                unit="yrs"
                placeholder="e.g. 25"
                keyboardType="number-pad"
                maxLength={3}
              />

              <PrimaryButton
                label="Calculate BMI"
                disabled={bmi === null}
                onPress={() => animateTo(true)}
                colors={['#818CF8', '#6366F1']}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
