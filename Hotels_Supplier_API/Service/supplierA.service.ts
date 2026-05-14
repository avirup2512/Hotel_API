import { SupplierAModel } from "../Model/supplierA.model.js";
export class SupplierAService {
    supplierModel:SupplierAModel;
    constructor()
    {
        this.supplierModel = new SupplierAModel();
    }

    async getHotels(args:any)
    {                     
        const {cityName,minPrice,maxPrice} = args;
        const results = await this.supplierModel.mockGetHotelsAsyncCall(cityName,minPrice,maxPrice);
        return results;
    }
}