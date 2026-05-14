import { SupplierBModel } from "../Model/supplierB.model.js";
export class SupplierBService {
    supplierBModel:SupplierBModel;
    constructor()
    {
        this.supplierBModel = new SupplierBModel();
    }

    async getHotels(args:any)
    {             
        const {cityName,minPrice,maxPrice} = args;
        const results = await this.supplierBModel.mockGetHotelsAsyncCall(cityName,minPrice,maxPrice);
        return results;
    }
}