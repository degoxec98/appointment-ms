# 📅 Appointment API

**Version:** 1.0.0  
This is a REST API to create and retrieve medical appointments for insured users across countries like Peru (PE) and Chile (CL).  


---

### 📌 Endpoints

---

#### ✅ POST `/appointment` - Create Appointment

Creates a new appointment for an insured user. 

**Request Body:**

```json
{
  "insuredId": "abc123",
  "scheduleId": 456,
  "countryISO": "PE"
}
```
**Required Fields:**

    insuredId: string

    scheduleId: number

    countryISO: "PE" or "CL"

**Response Example (200 OK):**
```json
{
  "id": "uuid",
  "insuredId": "abc123",
  "scheduleId": 456,
  "countryISO": "PE",
  "status": "pending",
  "creationDate": "2025-05-30T12:00:00Z",
  "lastUpdateDate": "2025-05-30T12:00:00Z"
}
```

---

#### 🔍 GET `/appointment/{insuredId}` - Get Appointments by Insured ID

Fetches all appointments for a given insured user.

**Path Parameter:**

    insuredId: string (e.g. abc123)

**Response Example (200 OK):**
```json
[
  {
    "id": "uuid",
    "insuredId": "abc123",
    "scheduleId": 456,
    "countryISO": "CL",
    "status": "completed",
    "creationDate": "2025-05-28T09:00:00Z",
    "lastUpdateDate": "2025-05-28T09:30:00Z"
  }
]
```
---

### 🔁 Possible Values

**Status:**

    pending: The appointment is not yet completed.

    completed: The appointment was successfully fulfilled.

**Country ISO:**

    PE: Peru

    CL: Chile

---

### 🚀 Deployment

This project uses Serverless Framework with TypeScript.

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Run tests: `npm run test`
4. Deploy: `npx serverless deploy`


