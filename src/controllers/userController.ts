import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";

class UserController {

    private userRepository = new UserRepository();

    async create(req: Request, res: Response): Promise<Response> {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nome, email e senha são obrigatórios!" });
        }

        try {
            const user = await this.userRepository.createUser(name, email, password);

            const customer_id = user.id;

            return res.status(201).json({
                success: true,
                message: "Usuário criado com sucesso!",
                data: { customer_id }
            });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar o usuário!" });
        }
    }

}

export { UserController };