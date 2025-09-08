export const MS_OAUTH_CONFIG = {
  clientId: process.env.MS_CLIENT_ID as string,
  clientSecret: process.env.MS_CLIENT_SECRET as string,
  redirectUri: process.env.MS_REDIRECT_URI as string,
  authUrl:
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  tokenUrl:
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  scope:
    [
      "offline_access",
      "User.Read",
      "Calendars.ReadWrite",
      "OnlineMeetings.ReadWrite",
    ].join(" "),
}; 