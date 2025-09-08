export const ZOOM_OAUTH_CONFIG = {
  clientId: process.env.ZOOM_CLIENT_ID as string,
  clientSecret: process.env.ZOOM_CLIENT_SECRET as string,
  redirectUri: process.env.ZOOM_REDIRECT_URI as string,
  authUrl: "https://zoom.us/oauth/authorize",
  tokenUrl: "https://zoom.us/oauth/token",
}; 