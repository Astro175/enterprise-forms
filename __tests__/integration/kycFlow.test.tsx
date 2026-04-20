import OnboardingLayout, { schema } from "@/app/onboarding/_layout";
import StepOneScreen from "@/app/onboarding/step1";
import { useKYCStore } from "@/stores/kycStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Redirect, router } from "expo-router";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

function TestWrapper({ children }: { children: ReactNode }) {
  const methods = useForm({ resolver: zodResolver(schema) });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

jest.mock("expo-router", () => ({
  Redirect: jest.fn(() => null),
  Slot: () => null,
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: () => ({}),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("Tests KYC Onboarding Flow", () => {
  beforeEach(() => {
    useKYCStore.setState({ _hasHydrated: false });
    (Redirect as jest.Mock).mockClear();
    (router.push as jest.Mock).mockClear()
  });
  it("Shows a loading spinner until hydration completes", () => {
    render(<OnboardingLayout />);
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("Checks when the lastCompletedStep is 1 and redirects to 2.", () => {
    useKYCStore.setState({ _hasHydrated: true, lastCompletedStep: 1 });
    render(<OnboardingLayout />);
    expect(Redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "/onboarding/step2" }),
      undefined,
    );
  });
  it("Checks when the lastCompletedStep is 2 and redirects to 3", () => {
    useKYCStore.setState({ _hasHydrated: true, lastCompletedStep: 2 });
    render(<OnboardingLayout />);

    expect(Redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "/onboarding/step3" }),
      undefined,
    );
  });
  it("Checks when lastCompletedStep is 3, no redirects", () => {
    useKYCStore.setState({ _hasHydrated: true, lastCompletedStep: 3 });
    render(<OnboardingLayout />);
    expect(Redirect).not.toHaveBeenCalled();
  });
  it("Checks if errors are raised when form values are invalid", async () => {
    render(
      <TestWrapper>
        <StepOneScreen />
      </TestWrapper>,
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Full Name"),
      "Precious David",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Email Address"),
      "aspark400!gmail.com",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Phone Number"),
      "08133769635",
    );
    fireEvent.press(screen.getByText("Next"));
    await waitFor(() => {
      expect(screen.getByText("Email format is incorrect")).toBeTruthy();
    });
  });
  it("Checks if the fields are correct, updates the store and navigate the user", async () => {
    const { result: formResult } = renderHook(() =>
      useForm({ resolver: zodResolver(schema) }),
    );

    render(
      <FormProvider {...formResult.current}>
        <StepOneScreen />
      </FormProvider>,
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Full Name"),
      "Precious David",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Email Address"),
      "aspark400@gmail.com",
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Phone Number"),
      "09033769635",
    );
    act(() => {
      formResult.current.setValue("dob", "2000-01-01");
    });

    fireEvent.press(screen.getByText("Next"));

    await waitFor(() => {
      expect(useKYCStore.getState().formData.name).toBe("Precious David");
      expect(useKYCStore.getState().lastCompletedStep).toBe(1);
      expect(router.push).toHaveBeenCalledWith("/onboarding/step2");
    });
  });
});
