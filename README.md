# 🚦 Rate Limiting Algorithms

This repository demonstrates different **Rate Limiting Algorithms** used to protect APIs and services from abuse, overload, and unfair usage.

---

## 📌 What is Rate Limiting?

Rate limiting is a **security and performance-driven traffic management technique** that restricts the number of requests a user or system can make to an API or service within a specified timeframe.

It helps to:

- 🛡 Prevent server overload  
- 🚫 Mitigate DDoS attacks  
- 🔐 Avoid API abuse  
- ⚖ Ensure fair usage  
- 🚀 Maintain system stability  

---

## 🧠 Implemented Algorithms

This project includes implementations of the following popular rate limiting algorithms:

---

### 1️⃣ Token Bucket Algorithm

The **Token Bucket** algorithm allows burst traffic while controlling the average request rate.

#### 🔹 How it works:
- A bucket fills with tokens at a steady rate.
- Each incoming request consumes one token.
- If the bucket is empty, the request is denied.
- Requests are allowed again when new tokens are added.

#### ✅ Best for:
- Handling burst traffic
- APIs needing flexible rate control

---

### 2️⃣ Leaky Bucket Algorithm

The **Leaky Bucket** algorithm ensures a constant output rate by processing requests steadily.

#### 🔹 How it works:
- Incoming requests are added to a queue (bucket).
- Requests are released at a fixed, constant rate.
- If the bucket is full, new incoming requests are discarded or queued.

#### ✅ Best for:
- Traffic shaping
- Smoothing burst traffic

---

### 3️⃣ Fixed Window Counter

The **Fixed Window** algorithm divides time into equal intervals and tracks request counts per window.

#### 🔹 How it works:
- Time is divided into fixed-size windows (e.g., 1 minute).
- Requests are counted within each window.
- If the count exceeds the limit, further requests are blocked until the next window.

#### ⚠ Limitation:
- Can cause burst traffic at window boundaries.

---

### 4️⃣ Sliding Window Log

The **Sliding Window** algorithm distributes request limits more evenly over time.

#### 🔹 How it works:
- Each request timestamp is logged.
- The system counts only the requests within the current rolling time window.
- Requests exceeding the limit are rejected.

#### ✅ Advantage:
- More accurate and fair than fixed window
- Smooth request distribution

---

