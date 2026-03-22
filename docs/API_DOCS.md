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
Daxil olmuş istifadəçinin profil məlumatlarını yeniləyir.
- **URL:** `/auth/update-me`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Professional Barber",
  "services": [
    { "name": "Saç kəsimi", "price": 15 },
    { "name": "Saqqal kəsimi", "price": 10 }
  ]
}
```
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

### 3. İstifadəçini Sil (Delete User)
İstifadəçini sistemdən tamamilə silir.
- **URL:** `/auth/users/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <ADMIN_TOKEN>`
- **Uğurlu Status:** `200 OK`

---

---

## 📅 Rezervasiya Sahəsi (Reservations)

### 1. Rezervasiya Yarat (Provider tərəfindən)
Xidmət təminatçısı özü üçün rezervasiya əlavə edir.
- **URL:** `/api/reservations`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "customerName": "Müştəri Adı",
  "customerPhone": "+994500000000",
  "note": "Xüsusi istək...",
  "service": "Saç kəsimi",
  "price": 15,
  "date": "2024-03-25",
  "startTime": "14:00",
  "endTime": "15:00"
}
```
- **Status:** Avtomatik `accepted` olur.

---

### 2. Rezervasiya Müraciəti (Müştəri tərəfindən)
Müştəri provider-in `userURL`-i vasitəsilə rezervasiya istəyi göndərir.
- **URL:** `/api/reservations/customer/:userURL`
- **Method:** `POST`
- **Body:**
```json
{
  "customerName": "Müştəri Adı",
  "customerPhone": "+994700000000",
  "note": "Gecikə bilərəm",
  "service": "Saç kəsimi",
  "price": 15,
  "date": "2024-03-25",
  "startTime": "10:00",
  "endTime": "11:00"
}
```
- **Status:** `pending` olaraq yaradılır, provider-in təsdiqi lazımdır.

---

### 3. Rezervasiyalarımı Gətir
Provider özünə aid bütün rezervasiyaları görür. Həmçinin statistika qaytarılır.
- **URL:** `/api/reservations`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Query Params:** `?status=pending` (isteğe bağlı: `accepted`, `rejected`, `pending`)
- **Cavab Nümunəsi:**
```json
{
  "stats": {
    "total": 10,
    "accepted": 5,
    "pending": 3,
    "rejected": 2
  },
  "reservations": [...]
}
```

---

### 4. Rezervasiya Statusunu Yenilə (Accept/Reject)
Provider gələn müraciəti təsdiqləyir və ya rədd edir.
- **URL:** `/api/reservations/:id/status`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "status": "accepted" 
}
```
*Status seçimləri: `"accepted"`, `"rejected"`, `"pending"`*

---

### 5. Rezervasiyanı Sil
- **URL:** `/api/reservations/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## 👥 Müştəri Sahəsi (Customers)

Bu sahə xidmət təminatçılarına öz müştəri bazalarını idarə etməyə imkan verir.

### 1. Yeni Müştəri Əlavə Et
- **URL:** `/api/customers`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "firstName": "Əli",
  "lastName": "Vəliyev",
  "email": "ali@example.com",
  "phone": "+994501234567",
  "note": "Daimi müştəri",
  "birthDate": "1990-05-15",
  "address": "Bakı ş., Nərimanov r."
}
```

### 2. Bütün Müştəriləri Gətir
- **URL:** `/api/customers`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <TOKEN>`

### 3. Müştəri Məlumatlarını Gətir (ID ilə)
- **URL:** `/api/customers/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <TOKEN>`

### 4. Müştəri Məlumatlarını Yenilə
- **URL:** `/api/customers/:id`
- **Method:** `PUT`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body:**
```json
{
  "note": "Yeni qeyd əlavə edildi",
  "phone": "+994701234567"
}
```

### 5. Müştərini Sil
- **URL:** `/api/customers/:id`
- **Method:** `DELETE`
- **Headers:** `Authorization: Bearer <TOKEN>`

---


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
