import { createHash } from "node:crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

function extractPublicId(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname.replace(/^\//, "");
    const parts = pathname.split("/");

    if (parts.length < 2) {
      return null;
    }

    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      return null;
    }

    const publicIdParts = parts.slice(uploadIndex + 1);
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const extension = lastPart.includes(".") ? lastPart.split(".").slice(1).join(".") : "";

    return publicIdParts.join("/").replace(new RegExp(`\\.${extension}$`), "");
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(imageUrl: string) {
  if (!cloudName || !apiKey || !apiSecret) {
    return;
  }

  const publicId = extractPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha256").update(signaturePayload).digest("hex");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: apiKey,
      signature,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary delete failed: ${message}`);
  }
}
