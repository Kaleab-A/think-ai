import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  checkIntegrationController,
  connectAppController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
  listCalendarsController,
  saveSelectedCalendarsController,
  zoomOAuthCallbackController,
  microsoftOAuthCallbackController,
} from "../controllers/integration.controller";

const integrationRoutes = Router();

integrationRoutes.get(
  "/all",
  passportAuthenticateJwt,
  getUserIntegrationsController
);

integrationRoutes.get(
  "/check/:appType",
  passportAuthenticateJwt,
  checkIntegrationController
);

integrationRoutes.get(
  "/connect/:appType",
  passportAuthenticateJwt,
  connectAppController
);

integrationRoutes.get("/google/callback", googleOAuthCallbackController);

integrationRoutes.get("/zoom/callback", zoomOAuthCallbackController);

integrationRoutes.get("/microsoft/callback", microsoftOAuthCallbackController);

integrationRoutes.get(
  "/calendars/:appType",
  passportAuthenticateJwt,
  listCalendarsController
);

integrationRoutes.put(
  "/calendars/:appType/select",
  passportAuthenticateJwt,
  saveSelectedCalendarsController
);

export default integrationRoutes;
