/** @type {import('next').NextConfig} */
const nextConfig = {
  dest: "public",
};

import pwa from "next-pwa";

const withPWA = pwa(nextConfig);

export default withPWA;
