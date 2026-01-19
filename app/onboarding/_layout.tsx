import { useKYCStore } from "@/stores/kycStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import z from "zod";

const schema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  dob: z.iso.date(),
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
        idCard: formData.identityCard
      });
    }
  }, [hasHydrated]);

  return (
    <View>
      <FormProvider {...methods}>
        <Slot />
      </FormProvider>
    </View>
  );
}
