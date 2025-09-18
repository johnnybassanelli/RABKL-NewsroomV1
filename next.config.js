/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove deprecated serverActions option
  },
  env: {
    PUBLISH_SECRET: process.env.PUBLISH_SECRET || 'RABKLsecretkey_92h3jd83',
    SLEEPER_LEAGUE_ID: process.env.SLEEPER_LEAGUE_ID || '1228186433580171264'
  }
};

module.exports = nextConfig;

