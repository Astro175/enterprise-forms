import { useKYCStore } from "@/stores/kycStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInYears, parseISO } from "date-fns";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import z from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Email format is incorrect"),
  phone: z.string("Invalid phone number"),
  dob: z.iso.date().refine(
    (date) => {
      const age = differenceInYears(new Date(), parseISO(date));
      if (age >= 18) return age;
    },
    { message: "Must be at least 18 years old" },
  ),
  address: z.string(),
  idCard: z.string(),
  selfie: z.string(),
});

export default function Layout() {
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
    }
  }, [hasHydrated]);

  return (
    <View style={{ flex: 1}}>
      <FormProvider {...methods}>
        <Slot />
      </FormProvider>
    </View>
  );
}
