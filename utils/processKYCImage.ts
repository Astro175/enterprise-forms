import { File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
type IdentityType = "selfie" | "identity-card";

export const processKYCImage = async (
  uri: string,
  identityType: IdentityType
): Promise<string> => {
  const context = ImageManipulator.manipulate(uri);

  context.resize({ width: 1024 });
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
  });

  // Object pointing to the file, I want to copy

  const fileName = new URL(result.uri).pathname.split("/").pop();

  if (!fileName) {
    throw new Error("Invalid file format");
  }
  const pointerToResizedImage = new File(Paths.cache, fileName);
  const copiedFile =
    identityType === "selfie"
      ? new File(Paths.document, "kyc_selfie.jpg")
      : new File(Paths.document, "kyc_id.jpg");
  pointerToResizedImage.copy(copiedFile);
  return copiedFile.uri;
};
