import { HotelService } from "../Service/Hotel.Service.js"
export class HotelController {
    hotelService:HotelService;
    constructor()
    {
        this.hotelService = new HotelService();
    }
    async getHotelsByParams(req:any,res:any)
    {        
        const queryArgument:any = {};
        if(req.query?.city)
            queryArgument.city = req.query?.city;
        if(req.query?.minPrice !== undefined)
            queryArgument.minPrice = req.query?.minPrice;
        if(req.query?.maxPrice !== undefined)
            queryArgument.maxPrice = req.query?.maxPrice;
        
        const results = await this.hotelService.getHotelByCityName(queryArgument);        
        res.json(results);
    }
}