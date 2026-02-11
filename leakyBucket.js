const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = 3000;

// Initialize Redis client
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

const BUCKET_KEY = "leaky_bucket";
const CAPACITY = 10;
const LEAK_RATE = 1000;

setInterval(async () => {
  const count = await redisClient.llen(BUCKET_KEY);
  if(count>0){
    await redisClient.rpop(BUCKET_KEY);
    console.log("leaked 1 request from the bucket::",count-1); 
  }
}, LEAK_RATE);


app.get("/", async (req, res) => {
  const count = await redisClient.llen(BUCKET_KEY);
  if(count<CAPACITY){
    await redisClient.lpush(BUCKET_KEY,Date.now());
    return res.status(200).json({message:"Welcome"});
  }else{
    return res.status(429).json({message: "Too many request"});
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});