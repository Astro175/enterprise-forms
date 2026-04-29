import NextButton from "@/components/NextButton";
import { ErrorMessage } from "@hookform/error-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const StepOneScreen = () => {
  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [show, setShow] = useState(false);
  const inputRefs = useRef<Record<string, TextInput  | null>>({});
  const { fromReview } = useLocalSearchParams<{ fromReview?: string }>();
  const nextRoute = fromReview === "true" ? "/review" : "/step2";

  const onError = (fieldName: string) => {
    inputRefs.current[fieldName]?.focus();
  };


  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{ padding: 10 }}>
          <Text
            style={{ marginBottom: 4, fontWeight: "600" }}
            nativeID="fullNameLabel"
          >
            Full Name
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <TextInput
                ref={(el) => {
                  inputRefs.current[name] = el;
                }}
                returnKeyLabel="next"
                onSubmitEditing={() => inputRefs.current['email']?.focus()}
                accessibilityLabelledBy="fullNameLabel"
                accessibilityLabel="Full Name"
                accessibilityHint="Enter your legal name as it appears on your ID"
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
            render={({ message }) => (
              <Text
                style={{ color: "#C62828" }}
                accessibilityLiveRegion="assertive"
              >
                {message}
              </Text>
            )}
          />
        </View>
        <View style={{ padding: 10 }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <TextInput
                accessibilityLabel="Email Address"
                accessibilityHint="Enter your valid email address for verification"
                inputMode="email"
                ref={(el) => {
                  inputRefs.current[name] = el;
                }}
                onSubmitEditing={() => inputRefs.current['phone']?.focus()}
                returnKeyLabel="Next"
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
            render={({ message }) => (
              <Text
                style={{ color: "#C62828" }}
                accessibilityLiveRegion="assertive"
              >
                {message}
              </Text>
            )}
          />
        </View>
        <View style={{ padding: 10 }}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value, name } }) => (
              <TextInput
                ref={(el) => {
                  inputRefs.current[name] = el;
                }}
                
                accessibilityLabel="Phone Number"
                accessibilityHint="Enter your 11 digit phone number"
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
            render={({ message }) => (
              <Text
                style={{ color: "#C62828" }}
                accessibilityLiveRegion="assertive"
              >
                {message}
              </Text>
            )}
          />
        </View>
        <View style={{ padding: 10 }}>
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value } }) => (
              <View>
                <Button
                  accessibilityLabel={
                    value ? `Date of birth: ${value}` : "Date of birth"
                  }
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
                  render={({ message }) => (
                    <Text
                      style={{ color: "#C62828" }}
                      accessibilityLiveRegion="assertive"
                    >
                      {message}
                    </Text>
                  )}
                />
              </View>
            )}
          />
        </View>
        <NextButton
          onError={onError}
          trigger={trigger}
          fields={["name", "email", "phone", "dob"]}
          nextRoute={nextRoute}
          lastCompletedStep={1}
        />
      </ScrollView>
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

export default StepOneScreen;
