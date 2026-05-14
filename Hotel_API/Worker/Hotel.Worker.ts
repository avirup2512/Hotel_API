import { Worker,NativeConnection  } from "@temporalio/worker";
import {fileURLToPath} from "url"
import {HotelModel } from "../Model/Hotel.Model.js";
const hotelModel =
  new HotelModel();
async function createConnection() {
  while (true) {
    try {
      console.log(
        "Trying Temporal:",
        process.env.TEMPORAL_ADDRESS
      );
      const connection =
        await NativeConnection.connect({
          address:
            process.env.TEMPORAL_ADDRESS ||
            "temporal:7233",
        });
      console.log(
        "Successfully Connected to Temporal"
      );
      return connection;
    } catch (err) {
      console.log(
        "Temporal not ready, retrying..."
      );
      await new Promise((res) =>
        setTimeout(res, 5000)
      );
    }
  }
}
async function run() { 
  const connection = await createConnection();
  const worker = await Worker.create({
    connection,
    workflowsPath: fileURLToPath(
    new URL(
        "../WorkFlow/Hotel.Workflow.ts",
        import.meta.url
    )
    ),
    activities: {

    getHotelsFromSupplierB:
      hotelModel.getHotelsFromSupplierB.bind(
        hotelModel
      ),
    getHotelsFromSupplierA:
      hotelModel.getHotelsFromSupplierA.bind(
        hotelModel
      )
    },
    taskQueue: "hotel-task-queue"
  });  
  await worker.run();
}
run().catch(console.error);