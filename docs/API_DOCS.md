# Glabbe API Documentasiyası 🚀

Bu sənəd Glabbe layihəsinin backend hissəsində olan bütün API-ləri və onların istifadə qaydalarını izah edir.

## 📌 Ümumi Məlumat
- **Base URL:** `http://localhost:5000/api`
- **Frontend URL (CORS):** `.env` faylındakı `BASE_URL`

---

## 🔐 Auth Sahəsi (Authentication)

### 1. Qeydiyyat (Register)
İstifadəçinin sistemdə yeni hesab yaratması üçün istifadə olunur.
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
```json
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+994500000000",
  "businessType": "doctor",
  "userURL": "john-profile"
}
```
- **Uğurlu Status:** `201 Created`
- **Qeyd:** Qeydiyyatdan sonra istifadəçiyə təsdiqləmə emaili göndərilir.

---

### 2. Giriş (Login)
Sistemə daxil olmaq və JWT token əldə etmək üçün.
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Uğurlu Status:** `200 OK`
- **Cavab:** `token` və `user` məlumatları.
- **Qeyd:** Email təsdiq olunmayıbsa girişə icazə verilmir.
- **Plan Məlumatı:** Cavabda `plan` ("adi" və ya "pro") və `subscriptionExpiration` (planın bitmə tarixi) qaytarılır.

---

### 3. Email Təsdiqləmə (Verify Email)
... (qaldığı kimi)

---

### 4. Şəxsi Məlumatlar (Get Me)
Daxil olmuş istifadəçinin profil məlumatlarını gətirir. Buraya `plan` və `subscriptionExpiration` da daxildir.

---

### 5. Profilin Yenilənməsi (Update Me)
... (qaldığı kimi)

---

## 👑 Admin Paneli (Yalnız Adminlər üçün)

### 1. Bütün İstifadəçiləri Getir
Sistemdəki bütün istifadəçilərin listini gətirir.
- **URL:** `/auth/users`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`

---

### 2. İstifadəçi Planını Yenilə
İstifadəçini PRO-ya keçirir və ya planını dəyişir.
- **URL:** `/auth/users/:id/plan`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
- **Body:**
```json
{
  "plan": "pro",
  "period": "month" 
}
```
*`period` seçimləri: `"month"`, `"year"`, `"7days"`*

---

## 🛡️ Təhlükəsizlik Tədbirləri
...
- **Helmet:** HTTP başlıqlarının təhlükəsizliyi.
- **CORS:** Yalnız icazə verilmiş domenlərin girişi.
- **Rate Limit:** 15 dəqiqə ərzində max 100 müraciət.
- **Password Hashing:** Şifrələr `bcryptjs` ilə qorunur.
- **JWT:** Avtorizasiya üçün token sistemi.

---

## ⚙️ Qurulum
1. `npm install`
2. `.env` faylını tənzimləyin.
3. `npm start`
