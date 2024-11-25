import { prisma } from "../config/prisma"

class DriverRepository {
    async findDriverById(driverId: string) {
        return prisma.driver.findUnique({
            where: {id: driverId},
            select: {
                id: true,
                name: true,
                description: true,
                car: true,
                rating: true,
                review: true,
                pricePerKm: true,
                minKm: true
            }
        });
    }

    async findDriversByAvailability(minDistance: number) {
        const drivers = await prisma.driver.findMany({
            where: {
                minKm: {
                    gte: minDistance
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                car: true,
                rating: true,
                review: true,
                pricePerKm: true,
                minKm: true
            }
        });

        return drivers || [];
    }
}

export { DriverRepository }