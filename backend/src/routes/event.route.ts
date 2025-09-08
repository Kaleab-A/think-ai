import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  createEventController,
  deleteEventController,
  getPublicEventByUsernameAndSlugController,
  getPublicEventsByUsernameController,
  getUserEventsController,
  toggleEventPrivacyController,
} from "../controllers/event.controller";

const eventRoutes = Router();

eventRoutes.post("/create", passportAuthenticateJwt, createEventController);
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventsController);

// for public without token
eventRoutes.get("/public/:username", getPublicEventsByUsernameController);

eventRoutes.get(
  "/public/:username/:slug",
  getPublicEventByUsernameAndSlugController
);

eventRoutes.put(
  "/toggle-privacy",
  passportAuthenticateJwt,
  toggleEventPrivacyController
);

eventRoutes.delete("/:eventId", passportAuthenticateJwt, deleteEventController);
export default eventRoutes;
