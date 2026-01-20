import { useKYCStore } from "@/stores/kycStore";
import { router } from "expo-router";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Text, TouchableOpacity } from "react-native";

const NextButton = ({
  trigger,
  fields,
  nextRoute,
}: {
  trigger: (name?: string | string[]) => Promise<boolean>;
  fields: string[];
  nextRoute: string;
}) => {
  const setFormData = useKYCStore((state) => state.setFormData);
  const { getValues } = useFormContext();
  const handlePress = async () => {
    const isValid = await trigger(fields);
    if (isValid) {
      router.push(nextRoute);
      setFormData(getValues());
    }
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ backgroundColor: "#004AAD", borderRadius: 12, padding: 10 }}
    >
      <Text style={{ color: "white" }}>Next</Text>
    </TouchableOpacity>
  );
};

export default NextButton;
