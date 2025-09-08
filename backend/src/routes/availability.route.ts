import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  getAvailabilityForPublicEventController,
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller";

const availabilityRoutes = Router();

availabilityRoutes.get(
  "/me",
  passportAuthenticateJwt,
  getUserAvailabilityController
);

availabilityRoutes.get(
  "/public/:eventId",
  getAvailabilityForPublicEventController
);

availabilityRoutes.put(
  "/update",
  passportAuthenticateJwt,
  updateAvailabilityController
);
export default availabilityRoutes;
