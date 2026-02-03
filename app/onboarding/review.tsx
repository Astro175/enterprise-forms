import { router } from "expo-router";
import React, { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FormValues } from "./_layout";
import { useKYCStore } from "@/stores/kycStore";

const SectionCard = ({ title, subtitle, children, route } : {title: string, subtitle: string, children: ReactNode, route: string}) => {
  return (
    <Pressable style={styles.card} android_ripple={{ color: "#E5E7EB" }} onPress={() => router.push(route)}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.editText}>Edit</Text>
      </View>

      <View style={styles.cardContent}>{children}</View>
    </Pressable>
  );
};

const LabelValue = ({ label, value } : {label: string, value: string}) => (
  <View style={styles.labelValueContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function KycReviewScreen() {
  const {getValues, handleSubmit} = useFormContext()
  const setKycStatus = useKYCStore(state => state.setKycStatus)


  const onSubmit = (data) => {
    setKycStatus('complete')
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review your information</Text>
        <Text style={styles.headerSubtitle}>
          Please confirm the details below before submission
        </Text>
      </View>

      {/* Personal Information */}
      <SectionCard
      route="onboarding/step1?fromReview=true"
        title="Personal Information"
        subtitle="Name, email, phone number and date of birth"
      >
        <LabelValue label="Full Name" value={getValues('name')} />
        <LabelValue label="Email Address" value={getValues('email')} />
        <LabelValue label="Phone Number" value={getValues('phone')} />
        <LabelValue label="Date of Birth" value={getValues('dob')} />
      </SectionCard>

      {/* Address */}
      <SectionCard title="Address" subtitle="Residential address information" route="onboarding/step2?fromReview=true">
        <LabelValue
          label="Home Address"
          value={getValues('address')}
        />
      </SectionCard>

      {/* Identity Verification */}
      <SectionCard
        title="Identity Verification"
        subtitle="Uploaded ID card and selfie"
        route='onboarding/step3?fromReview=true'
      >
        <View style={styles.imageRow}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: getValues('idCard') }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.imageLabel}>ID Card</Text>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: getValues('selfie') }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.imageLabel}>Selfie</Text>
          </View>
        </View>
      </SectionCard>

      {/* Footer Hint */}
      <Text style={styles.footerHint}>Tap any section to make changes</Text>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <Text>Submit for Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },
  editText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#004AAD",
  },
  cardContent: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  labelValueContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  value: {
    marginTop: 2,
    fontSize: 14,
    color: "#1F2937",
  },
  imageRow: {
    flexDirection: "row",
    gap: 12,
  },
  imageWrapper: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  imageLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },
  footerHint: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
  },
});
