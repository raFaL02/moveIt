import { Request, Response } from "express";
import { RideService } from "../services/rideService";

class RideController {

    private rideService = new RideService();

    async estimateRide(req: Request, res: Response): Promise<Response> {

        try {
            const {customer_id, origin, destination } = req.body;

            if (!customer_id || customer_id === "") {
                return res.status(400).json({error: "O Id do usuário é obrigatório!"});
            }

            if (!origin || !destination) {
                return res.status(400).json({error: "Origem e destino são obrigatórios!"});
            }

            if (destination == origin) {
                return res.status(400).json({error: "Origem e destino não podem ser iguais!"})
            }

            const result = await this.rideService.calculateRideEstimate(customer_id, origin, destination);
            return res.status(200).json(result);

        } catch(error) {
            const errorMessage = 
                error instanceof Error ? error.message: "Erro desconhecido";
            return res.status(500).json({error: errorMessage});
        }
    }

    async confirmRide(req: Request, res: Response): Promise<Response> {
        try {
            const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

            if (!customer_id || !origin || !destination || !driver || value == null) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
            }

            const result = await this.rideService.confirmRide({
                customer_id,
                origin,
                destination,
                distance,
                duration,
                driver,
                value,
            });

            return res.status(200).json({ message: "Viagem confirmada com sucesso!", ride: result });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            return res.status(500).json({ error: errorMessage });
        }
    }

    async getRide(req: Request, res: Response) {

        try {
            const { customer_id } = req.params;
            const { driverId } = req.query;

            if(!customer_id) {
                return res.status(400).json({error: "O campo customer_id é obrigatório"});
            }

            if(!driverId) {
                return res.status(400).json({
                    error_code: "INVALID",
                    message: "Motorista inválido!"
                });
            }

            const rides = await this.rideService.getRidesByCustomer(customer_id, Number(driverId));

            return res.status(200).json({
                customer_id,
                rides
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}

export { RideController };