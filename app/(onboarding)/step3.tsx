import NextButton from "@/components/NextButton";
import { processKYCImage } from "@/utils/processKYCImage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import React, { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function IdentityVerificationScreen() {
  const [isIdProcessing, setIsIdProcessing] = useState(false);
  const [idUploadError, setisIdUploadError] = useState("");
  const [selfieUploadError, setSelfieUploadError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const CameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isSelfieProcessing, setIsSelfieProcessing] = useState(false);
  const { control, trigger } = useFormContext();
  const onChangeRef = useRef<((...event: any[]) => void) | null>(null);

  const pickDocument = async (onChange: (...event: any[]) => void) => {
    try {
      setIsIdProcessing(true);
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "image/*",
      });

      if (result.canceled !== true) {
        const resizedDocument = await processKYCImage(
          result.assets[0].uri,
          "identity-card",
        );
        onChange(resizedDocument);
      }
    } catch (err) {
      setisIdUploadError("Invalid File Format");
    } finally {
      setIsIdProcessing(false);
    }
  };

  const retry = (onChange: (...event: any[]) => void) => {
    setisIdUploadError("");
    pickDocument(onChange);
  };

  const handleOpenCamera = async (onChange: (...event: any[]) => void) => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        setSelfieUploadError("Camera permission required");
        return;
      }
    }
    onChangeRef.current = onChange;
    setShowCamera(true);
  };

  const takePicture = async () => {
    try {
      const photo = await CameraRef.current?.takePictureAsync();
      setShowCamera(false);
      setIsSelfieProcessing(true);
      if (photo) {
        const resizedSelfie = await processKYCImage(photo.uri, "selfie");
        if (onChangeRef.current) {
          onChangeRef.current(resizedSelfie);
        }
      }
    } catch (err) {
      console.log(err);
      setSelfieUploadError("Failed to capture photo");
    } finally {
      setIsSelfieProcessing(false);
    }
  };

  const retakePicture = async (onChange: (...event: any[]) => void) => {
    setSelfieUploadError("");
    onChangeRef.current = onChange;
    setShowCamera(true);
  };

  const renderCamera = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CameraView ref={CameraRef} facing="front" style={{ flex: 1 }} />
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={takePicture}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: 85,
                height: 85,
                borderRadius: 999,
                borderWidth: 5,
                borderColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <View
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 999,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      {showCamera ? (
        renderCamera()
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Verify your identity</Text>
          <Text style={styles.subtitle}>
            To keep your account secure, please upload a valid ID and a selfie.
          </Text>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Government-issued ID</Text>
            <Text style={styles.sectionDesc}>
              Upload a clear photo of your National ID, Driver’s License, or
              Passport.
            </Text>
            <Controller
              control={control}
              name="idCard"
              render={({ field: { onChange, value, onBlur } }) => (
                <TouchableOpacity
                  style={styles.uploadBox}
                  activeOpacity={0.7}
                  onPress={() => pickDocument(onChange)}
                >
                  {isIdProcessing ? (
                    <ActivityIndicator size={48} />
                  ) : value ? (
                    <Image
                      source={{ uri: value }}
                      style={{ borderRadius: 10, height: 120, width: 200 }}
                    />
                  ) : idUploadError ? (
                    <View>
                      <TouchableOpacity onPress={() => retry(onChange)}>
                        <Text>Retry</Text>
                      </TouchableOpacity>
                      <Text>{idUploadError}</Text>
                    </View>
                  ) : (
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text style={styles.uploadIcon}>🪪</Text>
                      <Text style={styles.uploadText}>Tap to upload ID</Text>
                      <Text style={styles.uploadHint}>
                        JPG or PNG • Max 5MB
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />

            <Text style={styles.helperText}>
              Ensure all corners are visible and text is readable.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Selfie photo</Text>
            <Text style={styles.sectionDesc}>
              Take a selfie so we can match it with your ID.
            </Text>

            <Controller
              name="selfie"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  {value ? (
                    <Image
                      source={{ uri: value }}
                      style={{ borderRadius: 10, height: 120, width: 200 }}
                    />
                  ) : selfieUploadError ? (
                    <View>
                      <TouchableOpacity onPress={() => retakePicture(onChange)}>
                        <Text>Retry</Text>
                      </TouchableOpacity>
                      <Text>{selfieUploadError}</Text>
                    </View>
                  ) : isSelfieProcessing ? (
                    <ActivityIndicator size={48} />
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleOpenCamera(onChange)}
                    >
                      <View style={styles.selfieBox}>
                        <Text style={styles.uploadIcon}>📷</Text>
                        <Text style={styles.uploadText}>Take a selfie</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />

            <Text style={styles.helperText}>
              Use good lighting. No hat or sunglasses.
            </Text>
          </View>
          <NextButton
            trigger={trigger}
            fields={["selfie", "idCard"]}
            nextRoute="/onboarding/review"
            lastCompletedStep={3}
          />
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  stepText: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 14,
  },
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#6B7280",
  },
  card: {
    marginTop: 24,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  sectionDesc: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  uploadBox: {
    marginTop: 16,
    height: 140,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  selfieBox: {
    marginTop: 16,
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  uploadHint: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  helperText: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
  },
  button: {
    marginTop: "auto",
    marginBottom: 24,
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
