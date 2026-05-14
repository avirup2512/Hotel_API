 import { SupplierBService } from "../Service/supplierB.service.js";
 export class SupplierBController {
    supplierBService:SupplierBService;
    constructor(){
        this.supplierBService = new SupplierBService();
    }
    async getHotels(req:any,res:any)
    {
        const query = {cityName:req.query?.city,minPrice:req.query?.minPrice, maxPrice:req.query?.maxPrice} 
        const hotelsResult =  await this.supplierBService.getHotels(query);
        res.json(hotelsResult);
    }
}

