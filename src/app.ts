import dotenv from "dotenv";
import express from "express";
import { Router, Request, Response } from "express"

dotenv.config();

const app = express();

app.use(express.json());

const route = Router();

route.get("/", (req: Request, res: Response) => {
    res.json({ message: "Success!" });
});

app.use(route);

export default app;