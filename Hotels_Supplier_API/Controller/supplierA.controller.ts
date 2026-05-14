 import { SupplierAService } from "../Service/supplierA.service.js";
 export class SupplierAController {
    supplierAService:SupplierAService;
    constructor(){
        this.supplierAService = new SupplierAService();
    }
    async getHotels(req:any,res:any)
    {        
        const query = {cityName:req.query?.city,minPrice:req.query?.minPrice, maxPrice:req.query?.maxPrice}
        const hotelsResult =  await this.supplierAService.getHotels(query);
        res.json(hotelsResult);
    }
}

