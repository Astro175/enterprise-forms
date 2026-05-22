import { useKYCStore } from "@/stores/kycStore";
import { Redirect } from "expo-router";

export default function OnboardingIndex() {
  const lastCompletedStep = useKYCStore((state) => state.lastCompletedStep);

  if (lastCompletedStep !== null) {
    const nextStep = lastCompletedStep + 1;
    if (nextStep <= 3) {
      return <Redirect href={`/step${nextStep}`} />;
    }
  }

  return <Redirect href="/step1" />;
}
