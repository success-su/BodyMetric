import { Text, TextInput, View } from 'react-native';

export default function LabeledInput({
  label,
  value,
  onChangeText,
  unit,
  placeholder,
  keyboardType = 'decimal-pad',
  maxLength,
}) {
  return (
    <View className="mb-4 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          {label}
        </Text>
        {unit ? (
          <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            {unit}
          </Text>
        ) : null}
      </View>
      <TextInput
        className="text-2xl font-bold text-black py-1.5 border-b-2 border-black"
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C7C7C7"
      />
    </View>
  );
}
