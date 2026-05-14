import express from "express";
import { HotelController } from "../Controller/Hotel.Controller.js";
const router = express.Router();
const hotelController = new HotelController();
router.get("/hotels",hotelController.getHotelsByParams.bind(hotelController));
export default router;