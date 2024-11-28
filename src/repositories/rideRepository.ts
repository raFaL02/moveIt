import { prisma } from "../config/prisma";

class RideRepository {
    async createRide(data: {
        userId: string;
        driverId: number;
        origin: string;
        destination: string;
        distance: number;
        duration: string;
        price: number;
    }) {
        return prisma.ride.create({
            data: {
                userId: data.userId,
                driverId: data.driverId,
                origin: data.origin,
                destination: data.destination,
                distance: data.distance,
                duration: data.duration,
                price: data.price,
            },
        });
    }

    async findRidesByCustomer(userId: string, driver_id?: number) {
        
        const rides = await prisma.ride.findMany({
            where: {
                userId: userId,
                ...(driver_id && { driverId: driver_id })
            },
            include: {
                driver: { select: { id: true, name: true } },
            }
        });

        return rides;
    }
}

export { RideRepository };