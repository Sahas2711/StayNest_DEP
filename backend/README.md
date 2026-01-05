# StayNest 🏡

**StayNest** is a full-stack PG rental platform built with **Spring Boot** and **React**. It enables students and working professionals to search, book, and manage PG accommodations. Property owners can list their spaces, manage bookings, and interact with tenants.

---

## 🧱 Tech Stack

### 🔧 Backend – Spring Boot
- Java 17
- Spring Boot 3.5.3
- Spring Security
- Spring Data JPA
- JWT Authentication
- MySQL
- Mail Services
- Lombok

### 🎨 Frontend – React
- React 19.1
- Axios
- React Router DOM
- Leaflet (Map Integration)
- FontAwesome & React Icons
- Cloudinary Integration
- Formspree (Contact Queries)

---

## ⚙️ Backend Setup

### Key Dependencies in `pom.xml`

```xml
<dependencies>
  <!-- Spring Boot Starters -->
  <dependency>spring-boot-starter-web</dependency>
  <dependency>spring-boot-starter-data-jpa</dependency>
  <dependency>spring-boot-starter-security</dependency>
  <dependency>spring-boot-starter-mail</dependency>

  <!-- JWT -->
  <dependency>io.jsonwebtoken:jjwt-api</dependency>
  <dependency>io.jsonwebtoken:jjwt-impl</dependency>
  <dependency>io.jsonwebtoken:jjwt-jackson</dependency>

  <!-- Database -->
  <dependency>mysql:mysql-connector-j</dependency>

  <!-- Utilities -->
  <dependency>org.projectlombok:lombok</dependency>

  <!-- Testing -->
  <dependency>spring-boot-starter-test</dependency>
  <dependency>spring-security-test</dependency>
</dependencies>
```

---

## 🌐 Frontend Setup

### Highlights from `package.json`

```json
{
  "dependencies": {
    "axios": "^1.10.0",
    "leaflet": "^1.9.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.3",
    "react-leaflet": "^5.0.0",
    "react-icons": "^5.5.0",
    "@fortawesome/react-fontawesome": "^0.2.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "cross-env GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

---

## 📬 API Collection (Postman)

Test all backend APIs using our official Postman collection:

🔗 [StayNest Postman Collection](https://staynest-8483.postman.co/workspace/StayNest-Workspace~06eaec45-5767-4ddb-87fa-c11730b0ccf9/collection/42924698-c02e8c90-f958-4b69-ada4-cff502c3e19b?action=share&creator=42924698&active-environment=42924698-9645e053-d7a0-42a6-b3c6-94049c66d5d6)

### 💡 Features of Collection:
- User & Owner APIs
- JWT Auth workflows
- Listing, Booking, and Review endpoints
- Built-in environment variables for easy testing

---

## 🔐 Authentication Flow

- JWT-based login for **Users** and **Owners**
- Token sent in `Authorization` header using Axios
- Protected routes secured using `@PreAuthorize` annotations in the backend

---

## ✅ Feature Summary

- 👤 User & Owner registration and login
- 🏠 PG listing management (create, update, delete)
- 🔍 Search functionality by location, gender, budget
- 📅 Booking with rent calculation logic
- ✍️ Review system for properties
- 📧 Password reset via email
- 🌍 Map-based view using Leaflet & OpenStreetMap
- 📤 Cloudinary-based image upload
- 💬 Contact form integration (Formspree)

---

## 🚀 Running the Project Locally

### Start Backend
```bash
cd backend
mvn spring-boot:run
```

### Start Frontend
```bash
cd frontend
npm install
npm start
```

---

## 📌 Configuration Notes

- Ensure **CORS settings** in backend allow requests from frontend port (typically `http://localhost:3000`)
- Secure sensitive data via environment variables (e.g., Cloudinary, JWT secret, DB password)
- Ensure correct role-based access control in all protected routes

---

## 📧 Contact

For any support or questions, feel free to use the contact form:

👉 [StayNest Contact Support](https://formspree.io/f/xrblqpbe)

---

## 📄 License

This project is licensed under the **MIT License**  
© 2025 StayNest Project Team

