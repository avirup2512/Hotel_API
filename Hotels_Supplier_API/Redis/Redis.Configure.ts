import {createClient} from 'redis';
import dotenv from "dotenv";
dotenv.config();
export class RedisClient {
    redisClient:any;
    constructor()
    {           
        this.redisClient = createClient(
        {
            socket: {
            host: process.env.REDIS_HOST_URL|| "redis",
            port: Number(process.env.REDIS_PORT) || 6379,
            reconnectStrategy: (retries) => {
            console.log(`Retry attempt: ${retries}`);
                return Math.min(retries * 50, 500);
            }
            }, 
        }
        );
        this.redisClient.on('error', (err:any) => console.log('Redis Client Error', err));
        this.redisClient.on('connect', () => console.log('Connected to Redis'));
        this.redisClient.connect();
    }
    setRedisData = async (key:any, value:any) => {
        try {
            await this.redisClient.set(key, value);
        } catch (err) {
            console.error('Error setting Redis data:', err);
        }
    };
    getRedisData = async (key:any) => {
        try {
            const data = await this.redisClient.get(key);  
            return data;
        } catch (err) {
            console.error('Error getting Redis data:', err);
            return null;
        }
    };
    setRedisDataAsHash = async (key:any,data:any, value:any) => {
        try {            
            await this.redisClient.hSet(key,data, JSON.stringify(value));
        } catch (err) {
            console.error('Error setting Redis data:', err);
        }
    };

    getRedisDataAsHash = async (key:any,key2:any) => {
        try {
            const data:any = await this.redisClient.hGet(key,key2);
            return JSON.parse(data);
        } catch (err) {
            console.log("ERROR IS THERE AND HERE");
            
            console.error('Error getting Redis data:', err);
            return null;
        }
    };
    deleteRedisData = async (key:any) => {
        try {
            await this.redisClient.del(key); 
        } catch (err) {
            console.error('Error deleting Redis data:', err);
        }
    };
    async zAdd(score:number,hotelId:any,key:string)
    {
        try {
            await this.redisClient.zAdd(key,{score,value:hotelId})
        } catch (error) {
            console.error('Error deleting Redis data:', error);
        }
    }
    async zRangeByScore(key:string,params:any)
    {
        params.forEach((e:any)=>{
            if(e == undefined || e == null)
                e = -1
        });
        console.log(params);
        
        try {
            const hotelKeys = await this.redisClient.zRangeByScore(
            key,
            ...params
            );
            console.log(hotelKeys);
            
            return hotelKeys;
        } catch (error) {            
            console.error('Error getting Redis data:', error);
            return null;
        }
    }
    async zRange(key:string)
    {
        try {
            const hotelKeys = await this.redisClient.zRange(
            key,
            0,
            -1
            );
            return hotelKeys;
        } catch (error) {            
            console.error('Error getting Redis data:', error);
            return null;
        }
    }
    async getHashObjectFromKeysArray(keys:Array<any>)
    {
        const data = await Promise.all(
        keys.map(async (key:any) => {
            return await this.redisClient.hGetAll(
            key
            );
        })
        );
        return data;
    }
}
