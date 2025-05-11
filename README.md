Perfect! Here's the **updated and detailed PalesCare API documentation** including:

* **Endpoints**
* **Method**
* **Headers**
* **Input format (Request)**
* **Output format (Response)**
* ✅ Notes on Authentication (custom token without `Bearer`)

---

# 📘 **PalesCare API Documentation**

> **Base URL:** `http://localhost:5000/api/v1/`
> **Authentication:** Use `Authorization: <TOKEN>` (no `Bearer` prefix)

---

## 🔐 Authentication APIs

### ▶️ Login

* **Method:** `POST`
* **URL:** `/auth/login`
* **Request:**

```json
{
  "email": "superadmin@localhost",
  "password": "superadmin!"
}
```

* **Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

### ♻️ Refresh Token

* **Method:** `GET`
* **URL:** `/auth/refresh-token`
* **Request:** (empty)
* **Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "new-token"
  }
}
```

---

### 🔒 Change Password

* **Method:** `POST`
* **URL:** `/auth/change-password`
* **Headers:** `Authorization: <TOKEN>`
* **Request:**

```json
{
  "email": "user@example.com",
  "oldPassword": "123456",
  "newPassword": "12345678"
}
```

* **Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 👤 User APIs

### 🧑 Get All Users

* **Method:** `GET`
* **URL:** `/user`
* **Query (Optional):** `email`, `role`, `status`, `searchTerm`
* **Response:**

```json
{
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  },
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "DOCTOR",
      ...
    }
  ]
}
```

---

### 👤 Get My Profile

* **Method:** `GET`
* **URL:** `/user/me`
* **Headers:** `Authorization: <TOKEN>`
* **Response:** (user object)

---

### ✏️ Update My Profile

* **Method:** `PATCH`
* **URL:** `/user/update-my-profile`
* **Headers:** `Authorization: <TOKEN>`
* **Request:** `form-data`

  * `data`: JSON string of fields to update
  * `file`: optional image
* **Response:** (updated user object)

---

## 🧑‍⚕️ Doctor/Patient/Admin APIs

### ➕ Create

* **Method:** `POST`
* **URL:** `/user/create-doctor | create-admin | create-patient`
* **Request:** `form-data`

  * `data`: stringified user object
  * `file`: optional image
* **Response:**

```json
{
  "success": true,
  "message": "Doctor created successfully",
  "data": { ... }
}
```

---

### 🗑️ Soft Delete

* **Method:** `DELETE`
* **URL:** `/doctor/remove/{id}`
* **Response:** status message

---

## 📊 Meta Dashboard

* **Method:** `GET`
* **URL:** `/meta`
* **Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalDoctors": 50,
    ...
  }
}
```

---

## 📂 Schedule APIs

### ➕ Create Schedule

* **Method:** `POST`
* **URL:** `/schedule/create-schedule`
* **Request:**

```json
{
  "day": "MONDAY",
  "startTime": "09:00",
  "endTime": "12:00"
}
```

* **Response:** created schedule object

---

## 📅 Appointment APIs

### ➕ Create Appointment

* **Method:** `POST`
* **URL:** `/appointment/create-appointment`
* **Request:**

```json
{
  "doctorId": "uuid",
  "scheduleId": "uuid"
}
```

* **Response:** created appointment info

---

### 🗂️ My Appointments

* **Method:** `GET`
* **URL:** `/appointment/my-appointment?status=ONGOING&paymentStatus=UNPAID`
* **Headers:** `Authorization: <TOKEN>`
* **Response:** list of your appointments

---

## 💵 Payment APIs

### ➕ Initiate Payment

* **Method:** `POST`
* **URL:** `/payment/init-payment/{appointmentId}`
* **Response:** redirect link or status message

---

## 💊 Prescription

* **Method:** `POST`
* **URL:** `/prescription/create`
* **Request:**

```json
{
  "appointmentId": "uuid",
  "instructions": "<p>Zilas</p>",
  "followUpDate": "2025-06-10T03:07:59.853Z"
}
```

* **Response:** created prescription

---

## ⭐ Review

* **Method:** `POST`
* **URL:** `/review`
* **Request:**

```json
{
  "appointmentId": "uuid",
  "rating": 4.5,
  "comment": "Very good"
}
```

* **Response:** saved review

---

## 🔐 Authorization Notes

* Set header like this:

```
Authorization: eyJhbGciOi...   ← raw token only
```

No `Bearer` prefix is needed.

---

