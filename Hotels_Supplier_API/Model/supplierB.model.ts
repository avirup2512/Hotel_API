import fs from "fs/promises";
import type { Response } from "../ResponseMessageStructure/Response";
import { RedisClient } from "../Redis/Redis.Configure.js";
export class SupplierBModel {
    response:Response;
    redisClient:RedisClient;
    constructor()
    {
        this.response = {message:'',status:0}
        this.redisClient = new RedisClient();
    }
    private reOrganiseData(data:any)
    {
        data.forEach((e:any)=>{
            e.supplier = "SupplierB"
            delete e['hotelId']
            delete e['city'];
        });
        return data;
    }
    private validJSON(json:any)
    {
        try {
            JSON.parse(json);
            return true;
        } catch (error) {
            return false;
        }
    }
    async mockGetHotelsAsyncCall(cityName:string,minPrice?:number,maxPrice?:any)
    {
        try {            
            let hotelsData:any;
            const params = [minPrice !== undefined ? minPrice : 0 , maxPrice !== undefined ? maxPrice : -1];
            if(params.length > 0)
                hotelsData = await this.redisClient.zRangeByScore("hotels_by_price_supplier_B:"+cityName,params);
            else
                hotelsData = await this.redisClient.zRange("hotels_by_price_supplier_B:"+cityName);
            if(hotelsData.length > 0)
            {
                const getAllHashHotelsObject = await this.redisClient.getHashObjectFromKeysArray(hotelsData);
                let endHotelsObject = []
                for(var x=0 ; x < getAllHashHotelsObject.length ; x++)
                {
                    endHotelsObject.push(JSON.parse(getAllHashHotelsObject[x].hotels))
                    
                }
                endHotelsObject = this.reOrganiseData(endHotelsObject);
                this.response.message = "Hotels data has been fetched successfully";
                this.response.status = 200;
                this.response.data = endHotelsObject;
                return this.response;
            }
            if(hotelsData.length == 0)
            {
                if(cityName)
                hotelsData = await this.mockGetHotelByCityNameAsyncCall(cityName,minPrice,maxPrice);
                else
                    hotelsData = await this.mockGetAllHotelsAsyncCall();
            }else { 
                this.response.message = "Hotels data has been fetched successfully";
                this.response.status = 200;
                this.response.data = hotelsData;
                return this.response;
            }
            return hotelsData;
        } catch (error) {
            return error;
        }
    }
    async mockGetAllHotelsAsyncCall()
    {
        try {
            const hotelsData = await this.fileRead();
            return hotelsData;
        } catch (error) {
            return error;
        }
    }
    async mockGetHotelByCityNameAsyncCall(cityName:string,minPrice?:number,maxPrice?:number)
    {        
        try {            
            const hotelsData:any = await this.fileRead();
            let hotelsByMappedCity = [];
            if(hotelsData && hotelsData.data && hotelsData.data.length > 0)
            {
                hotelsByMappedCity = hotelsData.data.filter((e:any)=> e.city == cityName);                
                hotelsByMappedCity.forEach((hotel:any)=> {
                    this.redisClient.setRedisDataAsHash(`hotel:${hotel?.hotelId}`,"hotels",hotel);
                    this.redisClient.zAdd(hotel?.price,`hotel:${hotel?.hotelId}`,"hotels_by_price_supplier_B:"+cityName);
                })
                if(minPrice)
                    hotelsByMappedCity = hotelsByMappedCity.filter((e:any)=> e.price >= Number(minPrice));
                if(maxPrice)
                    hotelsByMappedCity = hotelsByMappedCity.filter((e:any)=> e.price <= Number(maxPrice));
            }
            hotelsByMappedCity = this.reOrganiseData(hotelsByMappedCity);
            this.response.message = "Hotels data has been fetched successfully";
            this.response.status = 200;
            this.response.data = hotelsByMappedCity;
            return this.response;
        } catch (error) {
            return error;
        }
    }
   private fileRead()
    {        
        const response = this.response;
        const self = this;
        return new Promise(async(resolve,reject)=>{
            try {
                let data:any = "";                
                const fileReader = await fs.open("./Hotels_Supplier_API/Demo_JSON_Data/SupplierB.json","r");                
                const stream = fileReader.createReadStream();                
                stream.on("data",function(chunk:Buffer){
                    data += chunk.toString();
                })
                stream.on("end",function() {
                    response.message = "Hotels data has been fetched successfully";
                    response.status = 200;
                    response.data = self.validJSON(data) ? JSON.parse(data) : data;
                    resolve(response);
                })
            } catch (error:any) {
                response.errorMessage = error.code;
                response.status = 400;
                reject(response);
            }
        })
   }
}