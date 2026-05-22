import { useKYCStore } from "@/stores/kycStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInYears, parseISO } from "date-fns";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import * as z from "zod";

import { SplashScreen } from "expo-router";

export const schema = z.object({
  name: z
    .string("Name must be at least 2 characters")
    .min(2, "Name must be at least 2 characters"),
  email: z.email("Email format is incorrect"),
  phone: z.string("Invalid phone number"),
  dob: z.iso.date("Enter a valid date").refine(
    (date) => {
      const age = differenceInYears(new Date(), parseISO(date));
      if (age >= 18) return true;
      return false;
    },
    { message: "Must be at least 18 years old" },
  ),
  address: z.string(),
  idCard: z.string(),
  selfie: z.string(),
});

export type FormValues = z.infer<typeof schema>;

SplashScreen.preventAutoHideAsync();

export default function OnboardingLayout() {
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      idCard: "",
      selfie: "",
    },
  });
  const formData = useKYCStore((state) => state.formData);
  const hasHydrated = useKYCStore((state) => state._hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      methods.reset({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        selfie: formData.selfie,
        idCard: formData.identityCard,
      });
      SplashScreen.hide();
    }
  }, [hasHydrated]);

  return (
    <View style={{ flex: 1 }}>
      <FormProvider {...methods}>
        <Slot />
      </FormProvider>
    </View>
  );
}
