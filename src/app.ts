import dotenv from "dotenv";
import express, { NextFunction } from "express";
import { Request, Response } from "express"
import { route } from "./routes/routes";
import cors from 'cors';


dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost',
  methods: 'GET,POST,PATCH,DELETE,PUT',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());

route.get("/", (req: Request, res: Response) => {
    res.json({ message: "Success!" });
});

app.use(route);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Erro desconhecido",
    });
  });

export default app;
