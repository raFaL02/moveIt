import { GoogleMapsService } from "./googleMapsService";
import { DriverRepository } from "../repositories/driverRepository";
import { UserRepository } from "../repositories/userRepository";
import { RideRepository } from "../repositories/rideRepository";


 class RideService {

    private googleMapsService = new GoogleMapsService();
    private driverRepository = new DriverRepository();
    private userRepository = new UserRepository();
    private rideRepository = new RideRepository();

    async calculateRideEstimate (userId: string, origin: string, destination: string) {

        const originCoordinates = await this.googleMapsService.getCoordinates(origin);
        const destinationCoordinates = await this.googleMapsService.getCoordinates(destination);

        const { distance, duration } = await this.googleMapsService.getDistanceAndDuration(originCoordinates, destinationCoordinates);

        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado!");
        }
        
        const drivers = await this.driverRepository.findDriversByAvailability(distance);
        if (drivers.length === 0) {
            throw new Error("Motorista não encontrado!");
        }

        const options = drivers.map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.car,
            review: {
                rating: driver.rating,
                comment:driver.review,
            },
            value: driver.pricePerKm * distance,
        }));
    
        return {
            origin: originCoordinates,
            destination: destinationCoordinates, distance,
            duration: `${Math.round(duration)} minutos`,
            options,
            routeResponse: {
                distance: `${distance.toFixed(2)} km`,
                duration: `${Math.round(duration)} minutos`,
            },
        };
    }

    async confirmRide(data: {
        userId: string;
        origin: string;
        destination: string;
        distance: number;
        duration: string;
        driver: { id: number; name: string };
        value: number;
    }) {
        const { userId, origin, destination, distance, duration, driver } = data;

        if (!userId || !origin || !destination) {
            throw new Error("Os campos userId, origin e destination são obrigatórios!");
        }

        if (origin === destination) {
            throw new Error("Origem e destino não podem ser iguais!");
        }

        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        const validDriver = await this.driverRepository.findDriverById(driver.id);
        if (!validDriver || validDriver.name !== driver.name) {
            throw new Error("Motorista informado não é válido!");
        }

        if (distance < validDriver.minKm) {
            throw new Error(`O motorista ${validDriver.name} não aceita corridas com distância menor que ${validDriver.minKm} km.`);
        }

        const savedRide = await this.rideRepository.createRide({
            userId: userId,
            driverId: driver.id,
            origin,
            destination,
            distance,
            duration,
            price: data.value,
        });

        return savedRide;
    }

    async getRidesByCustomer( userId: string, driverId: number) {
        if(!driverId) {
            const validDriver = await this.driverRepository.findDriverById(driverId);
            if(!validDriver) {
                throw new Error("Motorista inválido!");
            }
        } 

        const rides = await this.rideRepository.findRidesByCustomer(userId, driverId);

        return rides.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

}

export { RideService };
