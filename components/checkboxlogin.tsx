import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CheckboxProps = {
  checked: boolean;
  label: string;
  onPress: () => void;
};

const Checkbox = ({ checked, label, onPress }: CheckboxProps) => {
  return (
    <Pressable onPress={onPress} className="flex-row items-center">
      {/* Box */}
      <View
        className={`h-[1.5rem] w-[1.5rem] rounded-[.5rem] items-center justify-center mr-3 ${
          checked ? "bg-[#FF6A55]" : "bg-[#E9EAEB]"
        }`}
      >
        {checked && <Ionicons name="checkmark" size={20} color="white" />}
      </View>

      {/* Label */}
      <Text className="text-lg text-black">{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
