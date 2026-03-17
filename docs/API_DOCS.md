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

---

### 3. Email Təsdiqləmə (Verify Email)
Emaildə gələn link vasitəsilə hesabın aktiv edilməsi.
- **URL:** `/auth/verify-email/:token`
- **Method:** `GET`
- **Qeyd:** Bu link brauzerdə açılır və uğurlu olduqda vizual təsdiqləmə səhifəsi göstərir.

---

### 4. Şəxsi Məlumatlar (Get Me)
Daxil olmuş istifadəçinin profil məlumatlarını gətirir.
- **URL:** `/auth/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Uğurlu Status:** `200 OK`

---

## 🛡️ Təhlükəsizlik Tədbirləri
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
