import { google } from "googleapis";
import { config } from "./app.config";

//Google oauth
export const googleOAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  config.GOOGLE_REDIRECT_URI
);

//Zoom oauth
