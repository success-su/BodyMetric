import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
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
import { convertLength, roundTo } from '../utils/units';
import { usePersistedState } from '../utils/usePersistedState';
import { calculateWhr, whrCategory } from '../utils/whr';

const ACCENT = '#0D9488';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const UNITS = [
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
];

const DEFAULT_FORM = {
  gender: 'female',
  waist: '',
  hip: '',
  unit: 'cm',
};

export default function WHRScreen() {
  const [form, setForm] = usePersistedState('whr-form', DEFAULT_FORM);
  const [showResult, setShowResult] = useState(false);
  const { gender, waist, hip, unit } = form;

  const whr = useMemo(() => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (Number.isNaN(w) || Number.isNaN(h)) return null;
    return calculateWhr(w, h);
  }, [waist, hip]);

  const category = whrCategory(whr, gender);
  const thresholds =
    gender === 'male'
      ? [
          { value: 0.95, color: '#F59E0B' },
          { value: 1.0, color: '#EF4444' },
        ]
      : [
          { value: 0.8, color: '#F59E0B' },
          { value: 0.85, color: '#EF4444' },
        ];

  const setField = (patch) => setForm((f) => ({ ...f, ...patch }));

  const changeUnit = (nextUnit) => {
    setForm((f) => {
      const w = parseFloat(f.waist);
      const h = parseFloat(f.hip);
      const nextWaist =
        f.waist !== '' && !Number.isNaN(w)
          ? String(roundTo(convertLength(w, f.unit, nextUnit)))
          : f.waist;
      const nextHip =
        f.hip !== '' && !Number.isNaN(h)
          ? String(roundTo(convertLength(h, f.unit, nextUnit)))
          : f.hip;
      return { ...f, unit: nextUnit, waist: nextWaist, hip: nextHip };
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
          <View className="flex-row items-center mb-1">
            <View
              className="w-9 h-9 rounded-xl items-center justify-center mr-2.5"
              style={{ backgroundColor: '#F0FDFA' }}
            >
              <Ionicons name="body" size={18} color={ACCENT} />
            </View>
            <Text
              className="text-xs font-bold uppercase tracking-[3px]"
              style={{ color: ACCENT }}
            >
              Waist-to-Hip Ratio
            </Text>
          </View>
          <Text className="text-4xl font-extrabold text-black mb-1">WHR Calculator</Text>
          <Text className="text-neutral-500 mb-6">
            Enter your waist and hip measurements to check your Waist-to-Hip Ratio.
          </Text>

          {showResult ? (
            <ResultCard
              title="WHR"
              value={whr !== null ? whr.toFixed(2) : null}
              category={category}
              min={0.6}
              max={1.2}
              thresholds={thresholds}
              footnote="Measure waist and hip in the same unit. WHR is a screening tool, not a diagnosis."
              onReset={() => animateTo(false)}
            />
          ) : (
            <>
              <View className="mb-5">
                <GenderToggle value={gender} onChange={(g) => setField({ gender: g })} />
              </View>

              <View className="mb-4">
                <SegmentedToggle
                  options={UNITS}
                  value={unit}
                  onChange={changeUnit}
                  accentColor={ACCENT}
                />
              </View>
              <LabeledInput
                label="Waist"
                value={waist}
                onChangeText={(v) => setField({ waist: v })}
                unit={unit}
                placeholder={unit === 'cm' ? 'e.g. 80' : 'e.g. 31'}
              />
              <LabeledInput
                label="Hip"
                value={hip}
                onChangeText={(v) => setField({ hip: v })}
                unit={unit}
                placeholder={unit === 'cm' ? 'e.g. 100' : 'e.g. 39'}
              />

              <PrimaryButton
                label="Calculate WHR"
                disabled={whr === null}
                onPress={() => animateTo(true)}
                colors={['#2DD4BF', '#0D9488']}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
