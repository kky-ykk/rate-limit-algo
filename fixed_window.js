const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = 3000;

// Initialize Redis client
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUEST = 10;

const fixedWdindowRateLimiter = async (req,res,next)=>{
    const ip = req.ip;
    const key = `fixed_rate_limit:${ip}`;
    try {

        let requests = await redisClient.get(key);

        if(requests == null){
            await redisClient.set(key,1,'EX',WINDOW_SIZE_IN_SECONDS);
            requests =1;
        }else{
            requests = await redisClient.incr(key);
        }
        console.log("IP::",requests);
        
        if(requests>MAX_REQUEST)
            return res.status(429).json({
            message: "To many requests"
        })
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error"
        });
    }
}

app.use(fixedWdindowRateLimiter);

app.get('/',async (req,res)=>{
    return res.status(200).send("hi, your request");
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});