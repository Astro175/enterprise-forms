import NextButton from "@/components/NextButton";
import { ErrorMessage } from "@hookform/error-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const Screen = () => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext();
  const [show, setShow] = useState(false);
  const {fromReview} = useLocalSearchParams<{fromReview?: string}>()

    const nextRoute = fromReview === 'true' ? '/onboarding/review' : '/onboarding/step2'


  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
      <View style={{ padding: 10 }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Full Name"
              placeholderTextColor="#BEBEBE"
            />
          )}
        />
        <ErrorMessage
          name="name"
          errors={errors}
          render={({ message }) => <Text>{message}</Text>}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              inputMode="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Email Address"
              placeholderTextColor="#BEBEBE"
            />
          )}
        />
        <ErrorMessage
          name="email"
          errors={errors}
          render={({ message }) => <Text>{message}</Text>}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              inputMode="tel"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Phone Number"
              placeholderTextColor="#BEBEBE"
            />
          )}
        />
        <ErrorMessage
          name="phone"
          errors={errors}
          render={({ message }) => <Text>{message}</Text>}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Controller
          control={control}
          name="dob"
          render={({ field: { onChange, value } }) => (
            <View>
              <Button
                title={value ? value : "Select Date"}
                onPress={() => setShow(true)}
              />
              {show && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShow(false);
                    if (selectedDate) {
                      const currentDate = format(selectedDate, "yyyy-MM-dd");
                      onChange(currentDate);
                    }
                  }}
                />
              )}
              <ErrorMessage
                name="dob"
                errors={errors}
                render={({ message }) => <Text>{message}</Text>}
              />
            </View>
          )}
        />
      </View>
      <NextButton
        trigger={trigger}
        fields={["name", "email", "phone", "dob"]}
        nextRoute={nextRoute}
        lastCompletedStep={1}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  inputField: {
    backgroundColor: "#EFF2F6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  inputTextFieldText: {},
});

export default Screen;
