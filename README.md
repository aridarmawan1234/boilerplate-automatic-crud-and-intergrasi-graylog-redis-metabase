# BOILERPLATE CRUD AUTOMATIC CLI Generator

🚀 Sebuah CLI tool sederhana untuk membuat **CRUD Express.js** secara otomatis hanya dengan satu perintah di terminal.  
Cocok untuk prototyping, boilerplate project, atau belajar membangun generator di Node.js.

---

## ✨ Fitur
- Generate file **CRUD** berbasis Express.js dalam 1 file.
- Mendukung **field schema** (string, number, boolean).
- Auto-generate **router CRUD**:
  - `GET /` → list semua data
  - `GET /:id` → detail data
  - `POST /` → buat data baru
  - `PUT /:id` → update data
  - `DELETE /:id` → hapus data
- Auto-update `routes.js` supaya CRUD langsung terdaftar.
- Tidak pakai DB, data disimpan in-memory (bisa diadaptasi ke DB nyata).

---

## 📦 Instalasi
Clone repo dan install dependency:
```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
npm install
npm link ----> optional

---

** COMMAND CRUD API **
crud-gen api/user id:number name:string email:string