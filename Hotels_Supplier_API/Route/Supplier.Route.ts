import express from "express";
import { SupplierAController } from "../Controller/supplierA.controller.js";
import { SupplierBController } from "../Controller/supplierB.controller.js";
const router = express.Router();
const supplierA = new SupplierAController();
const supplierB = new SupplierBController();
router.get("/supplierA/hotels",supplierA.getHotels.bind(supplierA));
router.get("/supplierB/hotels",supplierB.getHotels.bind(supplierB));

export default router;