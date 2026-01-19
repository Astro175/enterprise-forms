import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type KycStatus = "incomplete" | "in_progress" | "complete";

export type FormDataType = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  selfie: string | undefined;
  identityCard: string | undefined;
};

type KYCStoreState = {
  formData: Partial<FormDataType>;
  kycStatus: KycStatus;
  lastCompletedStep: number | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
      _hasHydrated: false,
      lastCompletedStep: null,
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
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
    {
      name: "KYCStore",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
