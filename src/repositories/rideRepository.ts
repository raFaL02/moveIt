import { prisma } from "../config/prisma";

class RideRepository {
    async findAllRides() {
        return prisma.ride.findMany();
    }

    async createRide(data: { 
        driverId: string; 
        origin: string; 
        destination: string; 
        price: number; 
        distance: number;
    }) {
        return prisma.ride.create({ 
            data,
         });
    }
}

export { RideRepository };