import { Router } from "express";
import { RideController } from "../controllers/rideController";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middleware/asyncHandler";

const route = Router();

const rideController = new RideController();
const userController = new UserController();

route.post("/ride/estimate", asyncHandler((req, res) => rideController.estimateRide(req, res)));
route.post("/user", asyncHandler((req, res) => userController.create(req, res)));
route.patch("/ride/confirm", asyncHandler((req, res) => rideController.confirmRide(req, res)));
route.get("/ride/:customer_id", asyncHandler((req, res) => rideController.getRide(req, res)));

export { route };