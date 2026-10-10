import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "bazardor");

const appURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: appURL,
  secret: process.env.BETTER_AUTH_SECRET || "bazardor_super_secret_auth_key_1234567890_abcdefgh",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "https://b14-a07-bazar-dor.vercel.app",
    "https://*.vercel.app",
    "https://*.run.app",
    appURL,
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    minPasswordLength: 4,
  },
  emailVerification: {
    sendOnSignUp: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "Ov23lih863TVQ3yljnR4",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "f08f2ddc41f1003aab91ca654fe2496044007042",
      overrideUserInfoOnSignIn: true,
    },
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "230954650559-0r04ad53s3pss241fv6ldfg4l5r8g7nt.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      overrideUserInfoOnSignIn: true,
    },
  },
});