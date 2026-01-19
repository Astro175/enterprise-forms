import { useKYCStore } from "@/stores/kycStore";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen = () => {
  const { control } = useFormContext();
  
  return (
    <SafeAreaView>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />
    </SafeAreaView>
  );
};

export default Screen;
