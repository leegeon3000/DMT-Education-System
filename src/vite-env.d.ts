/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AUTH_TOKEN_SECRET: string;
  readonly VITE_AUTH_TOKEN_EXPIRY: string;
  readonly VITE_PAYMENT_GATEWAY_URL: string;
  readonly VITE_GOOGLE_CALENDAR_API_KEY: string;
  readonly VITE_SMS_PROVIDER_API_KEY: string;
  readonly VITE_ENABLE_2FA: string;
  readonly VITE_ENABLE_LOGGING: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
