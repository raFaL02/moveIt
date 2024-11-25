import { Router } from "express";
import { RideController } from "../controllers/rideController";
import { asyncHandler } from "../middleware/asyncHandler";

const route = Router();

const rideController = new RideController();

route.post("/ride/estimate", asyncHandler((req, res) => rideController.estimateRide(req, res)));

export { route };