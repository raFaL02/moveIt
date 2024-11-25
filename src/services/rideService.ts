import { GoogleMapsService } from "./googleMapsService";
import { DriverRepository } from "../repositories/driverRepository";

 class RideService {

    private googleMapsService = new GoogleMapsService();
    private driverRepository = new DriverRepository();

    async calculateRideEstimate (origin: string, destination: string, driverId: string) {

        const originCoordinates = await this.googleMapsService.getCoordinates(origin);
        const destinationCoordinates = await this.googleMapsService.getCoordinates(destination);


        const { distance, duration} = await this.googleMapsService.getDistanceAndDuration(originCoordinates, destinationCoordinates);
        
        const drivers = await this.driverRepository.findDriversByAvailability(distance);

        if (!drivers) {
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
