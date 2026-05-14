import axios from "axios";
export class HotelModel {
    private hotelsList:Array<any> = [];
    private combineResults(data:any)
    {        
        if(data && data.length > 0)
        {
            data.forEach((e:any)=>{
                if(e.data && e.data.length > 0)
                    e.data.forEach((d:any)=>{
                        this.hotelsList.push(d);
                    })
            })
        }
    }
    private urlQueryCreate(url:string,argsObj:any)
    {
        if(Object.keys(argsObj).length > 0)
        {
            let count = 1
            for(let x in argsObj)
            {
                if(count == 1)
                    url += "?"+x+"="+argsObj[x];
                else
                    url += "&"+x+"="+argsObj[x];
                count++;
            }
        }
        return url;
    }
    private comparePrices(data:any)
    {
        let hotelsMap = new Map();
        if(data && data.length > 0)
        {
            data.forEach((e:any)=>{
                if(e.name && hotelsMap.has(e.name))
                {
                    const hotel = hotelsMap.get(e.name);
                    if(hotel.price > e.price)
                        hotelsMap.set(e.name,e);
                }else
                    hotelsMap.set(e.name,e);
            })
        }
        return [...hotelsMap.values()];
    }
    async getHotelsFromSupplierA(args:any)
    {
        return new Promise(async (resolve,reject)=>{
            try {                
                let url = process.env.HOTEL_SUPPLIER_A_URL || 'http://api:3000/hotelAPI/supplierA/hotels';
                let editedUrl = this.urlQueryCreate(url,args);
                const result = await axios.get(editedUrl);
                resolve(result.data);
            } catch (error) {
                reject(error)
            }
        })
    }
    async getHotelsFromSupplierB(args:any)
    {
        return new Promise(async (resolve,reject)=>{
            try {
                let url = process.env.HOTEL_SUPPLIER_B_URL || 'http://api:3000/hotelAPI/supplierB/hotels';
                let editedUrl = this.urlQueryCreate(url,args);
                const result = await axios.get(editedUrl);
                resolve(result.data);
            } catch (error) {
                reject(error)
            }
        })
    }
    async getHotelsFromAllSupplier(args:any)
    {
        const result = await Promise.all([this.getHotelsFromSupplierA(args),this.getHotelsFromSupplierB(args)]);        
        this.hotelsList = [];
        this.combineResults(result);
        return this.comparePrices(this.hotelsList);
    }
}