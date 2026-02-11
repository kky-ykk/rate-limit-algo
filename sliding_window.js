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

const slidingWindowRateLimiter = async (req, res, next) => {
  // Normalize IPv6 localhost
  let ip = req.ip === "::1" ? "127.0.0.1" : req.ip;

  // Use a safe, unique namespace for ZSET
  const key = `sliding_zset_rate_limit:${ip}`;
  const now = Date.now(); // milliseconds

  try {
    // 🛡️ Defensive: ensure key is ZSET
    const type = await redisClient.type(key);
    if (type !== "zset" && type !== "none") {
      await redisClient.del(key);
    }

    // Remove requests outside the sliding window
    await redisClient.zremrangebyscore(
      key,
      0,
      now - WINDOW_SIZE_IN_SECONDS * 1000
    );

    // Count requests in current window
    const requests = await redisClient.zcard(key);
    console.log(`IP: ${ip}, Requests: ${requests}`);

    if (requests >= MAX_REQUEST) {
      return res.status(429).json({
        message: "You have exceeded the rate limit",
      });
    }

    // Add current request timestamp
    await redisClient.zadd(key, now, now.toString());

    // Set expiry to prevent memory leaks
    await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

app.use(slidingWindowRateLimiter);

app.get("/", (req, res) => {
  res.send("hi, your request");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
