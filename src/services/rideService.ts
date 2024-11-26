import { GoogleMapsService } from "./googleMapsService";
import { DriverRepository } from "../repositories/driverRepository";
import { UserRepository } from "../repositories/userRepository";


 class RideService {

    private googleMapsService = new GoogleMapsService();
    private driverRepository = new DriverRepository();
    private userRepository = new UserRepository();

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

}

export { RideService };
