import { prisma } from "../config/prisma";

class UserRepository {

    async createUser(name: string, email:string, password: string) {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        });

        return user;
    }

    async findUserById(customer_id: string): Promise<{ id: string } | null> {
        console.log("Buscando usuário com ID:", customer_id);
        
        if (!customer_id) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: customer_id },
            select: { id: true },
        });

        return user;
    }
}

export { UserRepository };