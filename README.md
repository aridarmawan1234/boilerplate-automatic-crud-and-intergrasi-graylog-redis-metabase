# 🚀 BOILERPLATE CRUD AUTOMATIC CLI Generator & Metabase on Docker

This repository contains **two main tools**:
1. **CRUD Automatic CLI Generator** – A Node.js CLI tool to generate Express.js CRUD APIs instantly.
2. **Metabase on Docker** – A Docker Compose setup to run Metabase with PostgreSQL, Redis, and MongoDB.

---

# 📌 Part 1: CRUD Automatic CLI Generator

A simple **Node.js CLI tool** to automatically generate **Express.js CRUD APIs** with just one terminal command.  
This is useful for **prototyping**, **boilerplate projects**, or learning how to build code generators in Node.js.

---

## ✨ Features
- ⚡ Generate **CRUD file** (Express.js Router) instantly in a single file.
- 📑 Supports **field schema types** (`string`, `number`, `boolean`).
- 🔄 Auto-generate standard CRUD endpoints:
  - `GET /` → List all data
  - `GET /:id` → Get single data by ID
  - `POST /` → Create new data
  - `PUT /:id` → Update data
  - `DELETE /:id` → Delete data
- 🛠 Automatically updates `routes.js` so the generated CRUD is registered instantly.
- 🗃 In-memory data store (easily adaptable to real databases).
- 🔌 Support for adding **middleware** (auth, logger, etc.).

**Command CRUD**
  - crud-gen api/user id:number name:string email:string

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
npm install
