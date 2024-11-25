import { Request, Response } from "express";
import { RideService } from "../services/rideService";

class RideController {

    private rideService = new RideService();

    async estimateRide(req: Request, res: Response): Promise<Response> {

        try {
            const { origin, destination, driverId } = req.body;

            if (!origin || !destination) {
                return res.status(400).json({error: "Origem e destino são obrigatórios!"});
            }

            if (!driverId) {
                return res.status(400).json({error: "Id do motorista é obrigatório!"})
            } 

            if (destination == origin) {
                return res.status(400).json({error: "Origem e destino não podem ser iguais!"})
            }

            const result = await this.rideService.calculateRideEstimate(origin, destination, driverId);
            return res.status(200).json(result);

        } catch(error) {
            const errorMessage = 
                error instanceof Error ? error.message: "Erro desconhecido";
            return res.status(500).json({error: errorMessage});
        }
    }
}

export { RideController };