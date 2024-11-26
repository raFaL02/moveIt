import { Router } from "express";
import { RideController } from "../controllers/rideController";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middleware/asyncHandler";

const route = Router();

const rideController = new RideController();
const userController = new UserController();

route.post("/ride/estimate", asyncHandler((req, res) => rideController.estimateRide(req, res)));
route.post("/user", asyncHandler((req, res) => userController.create(req, res)));

export { route };