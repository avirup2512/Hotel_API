import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
import SupplierRoute from "./Hotels_Supplier_API/Route/Supplier.Route.js";
import HotelRoute from "./Hotel_API/Route/Hotel.Route.js";

app.use(express.json());

app.use("/api",HotelRoute);
app.use("/hotelAPI",SupplierRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
