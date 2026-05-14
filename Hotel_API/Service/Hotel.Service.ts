import { HotelModel } from "../Model/Hotel.Model.js";
import { Connection, Client } from "@temporalio/client";

export class HotelService{
    hotelModel:HotelModel;
    constructor()
    {
        this.hotelModel = new HotelModel();
    }
    async connectTemporal() {
        while (true) {
            try {
                    const connection = await Connection.connect({
                        address: process.env.TEMPORAL_ADDRESS || "temporal:7233",
                        connectTimeout: 5000,
                    });

                    console.log("Connected to Temporal--");

                    return connection;
                } catch (err) {
                    console.log("Waiting for Temporal...");
                    await new Promise((res) => setTimeout(res, 5000));
                }
        }
    }
    async getHotelByCityName(args:any)
    {   
        console.log("THLU");
        const connection = await this.connectTemporal();        
        const client = new Client({
            connection
        });        
        const handle =
        await client.workflow.start(
            "compareHotelsWorkflow",
            {
            args:[args],
            taskQueue: "hotel-task-queue",
            workflowId: `hotel-${Date.now()}`
            }
        );
        const results = await handle.result();
        console.log(results)
        // WITHOUT TEMPORAL API CALL
        // const results = await this.hotelModel.getHotelsFromAllSupplier(args);
        return results;
    }
}