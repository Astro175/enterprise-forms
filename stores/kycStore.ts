import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type KycStatus = "incomplete" | "in_progress" | "complete";

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  DOB: number;
  address: string;
  selfie: string | undefined;
  identityCard: string | undefined;
};

type KYCStoreState = {
  formData: Partial<FormDataType>;
  kycStatus: KycStatus;
  lastCompletedStep: number | null;
  setLastCompletedStep: (stepNumber: number) => void;
  setFormData: (data: Partial<FormDataType>) => void;
  setKycStatus: (status: KycStatus) => void;
  resetForm: () => void;
  clearFormData: () => void;
};

export const useKYCStore = create<KYCStoreState>()(
  persist(
    (set) => ({
      formData: {},
      kycStatus: "incomplete",
      lastCompletedStep: null,
      setLastCompletedStep(stepNumber) {
        set({ lastCompletedStep: stepNumber });
      },

      setFormData(data) {
        set((prev) => ({ formData: { ...prev.formData, ...data } }));
      },
      setKycStatus(status) {
        set({ kycStatus: status });
      },
      resetForm() {
        set({
          formData: {},
          lastCompletedStep: null,
          kycStatus: "incomplete",
        });
      },
      clearFormData() {
        set({ formData: {}, lastCompletedStep: null });
      },
    }),
    { name: "KYCStore", storage: createJSONStorage(() => AsyncStorage) }
  )
);
