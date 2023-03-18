/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "be.isaiasdev.com",
        port: "",
        pathname: `/v1/storage/buckets/${process.env.NEXT_PUBLIC_USER_AVATARS_BUCKET}/files/**`,
      },
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
