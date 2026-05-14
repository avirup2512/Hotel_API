import { proxyActivities } from "@temporalio/workflow";
interface HotelModel {
    getHotelsFromSupplierA(city:string,minPrice?:number,maxPrice?:number):Promise<any>
    getHotelsFromSupplierB(city:string,minPrice?:number,maxPrice?:number):Promise<any>
}
let hotelsList:Array<any> = [];
const combineResults = function(data:any)
    {        
        if(data && data.length > 0)
        {
            data.forEach((e:any)=>{
                if(e.data && e.data.length > 0)
                    e.data.forEach((d:any)=>{
                        hotelsList.push(d);
                    })
            })
        }
    }
const comparePrices = function(data:any)
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
const activities =
  proxyActivities<HotelModel>({
    startToCloseTimeout: "1 minute",
    retry: {
      maximumAttempts: 3
    }
  });

export async function compareHotelsWorkflow(cityName: string,minPrice?:number,maxPrice?:number) {
  const [hotelA, hotelB] = await Promise.all([
    activities.getHotelsFromSupplierA(cityName,minPrice,maxPrice),
    activities.getHotelsFromSupplierB(cityName,minPrice,maxPrice)
  ]);
  console.log(hotelA);
  console.log(hotelB);
  const hotels = [...hotelA.data, ...hotelB.data];
  
  return comparePrices(hotels);
}