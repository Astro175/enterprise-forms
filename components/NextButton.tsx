import { useKYCStore } from "@/stores/kycStore";
import { router } from "expo-router";
import React from "react";
import { useFormContext } from "react-hook-form";
import { AccessibilityInfo, Text, TouchableOpacity } from "react-native";

const NextButton = ({
  trigger,
  fields,
  nextRoute,
  lastCompletedStep,
  onError,
}: {
  trigger: (name?: string | string[]) => Promise<boolean>;
  fields: string[];
  nextRoute: string;
  lastCompletedStep: number;
  onError?: (fieldName: string) => void;
}) => {
  const setFormData = useKYCStore((state) => state.setFormData);
  const {
    formState: { errors },
  } = useFormContext();
  const setLastCompletedStep = useKYCStore(
    (state) => state.setLastCompletedStep,
  );
  const { getValues } = useFormContext();
  const handlePress = async () => {
    const isValid = await trigger(fields);
    if (isValid) {
      router.push(nextRoute);
      setFormData(getValues());
      setLastCompletedStep(lastCompletedStep);
    } else {
      const firstErrorField = fields.find((field) => errors[field]);
      AccessibilityInfo.announceForAccessibility(
        errors[firstErrorField!]?.message as string,
      );
      if (onError) {
        onError(firstErrorField!);
      }
    }
  };
  return (
    <TouchableOpacity
      accessibilityLabel="Next"
      role="button"
      accessibilityHint="Continues to the next step."
      onPress={handlePress}
      style={{ backgroundColor: "#004AAD", borderRadius: 12, padding: 10 }}
    >
      <Text style={{ color: "white" }}>Next</Text>
    </TouchableOpacity>
  );
};

export default NextButton;
