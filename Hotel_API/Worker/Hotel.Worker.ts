import { Worker,NativeConnection  } from "@temporalio/worker";
import {fileURLToPath} from "url"
import {HotelModel } from "../Model/Hotel.Model.js";
const hotelModel =
  new HotelModel();

async function run() { 
  const connection = await NativeConnection.connect({
    address:"temporal:7233",
  });
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
  console.log("GYANAM DHYANAM SANTAM HARI");
  
  await worker.run();
}

run().catch(console.error);