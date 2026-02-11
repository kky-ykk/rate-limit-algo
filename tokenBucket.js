const express = require("express");
const Redis = require("ioredis");

const app = express();
const PORT = 3000;

// Initialize Redis client
const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

const BUCKET_KEY = "token_bucket";
const CAPACITY = 10;
const REFIL_RATE = 2000;

setInterval(async () => {
  let tokens = await redisClient.get(BUCKET_KEY);
  tokens = tokens ? parseInt(tokens):CAPACITY;
  let newTokens = Math.min(CAPACITY,tokens+1);
  await redisClient.set(BUCKET_KEY,newTokens);
  console.log("total available token",newTokens);
}, REFIL_RATE);

// Rate limiting middleware
const rateLimiter = async (req, res, next) => {
  let tokens = await redisClient.get(BUCKET_KEY);
  tokens = tokens ? parseInt(tokens): CAPACITY;
  if(tokens> 0){
    await redisClient.decr(BUCKET_KEY);
    next();
  }else{
    return res.status(429).json({message:"too many request"});
  }
};

// Apply rate limiter to all routes
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});