import express from "express";
import { Router, Request, Response } from "express";

const app = express();

const route = Router();

app.use(express.json());

route.get('/', (req: Request, res: Response) => {
    res.json({message: "Sucess!"});
});

app.use(route);

const PORT = 8080;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));