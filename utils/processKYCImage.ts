import { File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
type IdentityType = "selfie" | "identity-card";

export const processKYCImage = async (
  uri: string,
  identityType: IdentityType,
): Promise<string> => {
  const context = ImageManipulator.manipulate(uri);

  context.resize({ width: 1024 });
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
  });

  const parts = new URL(result.uri).pathname.split("/").filter(Boolean);

  const fileName = parts.at(-1);
  const subdirectory = parts.at(-2);

  if (!fileName || !subdirectory) {
    throw new Error("Invalid file format");
  }
  const pointerToResizedImage = new File(Paths.cache, subdirectory, fileName);

  const copiedFile =
    identityType === "selfie"
      ? new File(Paths.document, "kyc_selfie.jpg")
      : new File(Paths.document, "kyc_id.jpg");
  pointerToResizedImage.copy(copiedFile);
  return copiedFile.uri;
};
