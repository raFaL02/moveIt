import { Client } from "@googlemaps/google-maps-services-js";

class GoogleMapsService {

    private client = new Client();

    async getCoordinates(address: string): Promise<{ latitude: number; longitude: number }> {
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("A chave da API do Google Maps não foi encontrada.");
        }

        const response = await this.client.geocode({
            params: {
                address: address,
                key: apiKey,
            },
        });

        const location = response.data.results[0]?.geometry?.location;

        if (!location) {
            throw new Error("Não foi possível obter as coordenadas para o endereço fornecido.");
        }

        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    }

    async getDistanceAndDuration(
        origin: {latitude: number, longitude: number},
        destination: {latitude: number, longitude: number}
    ): Promise<{distance: number, duration: number}> {

        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            throw new Error("A chave da API do Google Maps não foi encontrada.");
        }

        const response = await this.client.distancematrix({
            params: {
                origins: [`${origin.latitude},${origin.longitude}`],
                destinations: [`${destination.latitude},${destination.longitude}`],
                key: apiKey,
            },
        });

        if (response.data.status !== 'OK') {
            throw new Error("Erro ao calcular distancia!")
        }
        const distanceInMeters = response.data.rows[0].elements[0].distance.value;
        const durationInSeconds = response.data.rows[0].elements[0].duration.value;

        const distanceInKm = distanceInMeters / 1000;
        const durationInMinutes = durationInSeconds / 60;

        return {
            distance: distanceInKm,
            duration: durationInMinutes,
        };
    }  
}

export { GoogleMapsService }