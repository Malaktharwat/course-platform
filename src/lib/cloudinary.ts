import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function generateSignedVideoUrl(publicId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + 7200;

  return cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'authenticated',
    sign_url: true,
    expires_at: expiresAt,
    format: 'mp4',
  });
}

export function generateUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const params = {
    timestamp,
    folder,
    resource_type: 'video',
    type: 'authenticated',
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return { signature, timestamp, ...params };
}