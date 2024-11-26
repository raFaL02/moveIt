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

    async findUserById(userId: string): Promise<{ id: string } | null> {
        console.log("Buscando usuário com ID:", userId);
        
        if (!userId) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        return user;
    }
}

export { UserRepository };