# Fixify - Service Provider Marketplace

![Fixify Logo](https://jolly-macaron-6caae5.netlify.app/assets/logo-tAwWv5Qn.png)

## 🌐 Live Deployment

- **Frontend:** [https://jolly-macaron-6caae5.netlify.app](https://jolly-macaron-6caae5.netlify.app)  
- **Backend API:** [https://fixme-production.up.railway.app](https://fixme-production.up.railway.app)

---

## 📌 Project Overview

Fixify is a full-featured service marketplace platform that connects service providers with customers needing home repairs, maintenance, and other services.

---

## ✨ Features

### 👤 For Service Needers (Customers)
- Browse service providers by type, location, and availability  
- Book services with detailed requirements  
- Schedule appointments with flexible time slots  
- Track service requests in real-time  
- Rate and review providers  
- Secure payment integration  

### 👨‍🔧 For Service Providers
- Create and manage profiles  
- Showcase skills, experience, and certifications  
- Set availability and service areas  
- Manage bookings and appointments  
- Receive real-time notifications  
- Chat with customers through the platform  

### 🛠️ For Administrators
- Admin dashboard for platform management  
- User and service category management  
- Verify service providers  
- Monitor activities and usage metrics  
- Generate reports and insights  

---

## ⚙️ Technologies Used

### Frontend
- React 19.x with TypeScript  
- Vite as build tool  
- React Router for navigation  
- Socket.IO (client) for real-time updates  
- Styled-components for styling  
- Framer Motion for animations  
- React Icons for UI  

### Backend
- Node.js with Express.js  
- MongoDB + Mongoose  
- JWT for authentication  
- bcrypt for password hashing  
- Nodemailer for email functionality  
- Socket.IO for real-time communication  

### DevOps & Deployment
- Frontend: Hosted on Netlify  
- Backend: Hosted on Railway  
- Database: MongoDB Atlas  
- GitHub for version control  
- CI/CD pipelines  

---

## 📁 Project Structure

```
Fixify/
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   │   ├── admin/
│   │   ├── serviceNeeder/
│   │   ├── serviceProvider/
│   │   └── shared/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── Back-End/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── public/
├── netlify.toml
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js (v16 or above)  
- MongoDB (local or Atlas)  
- npm or yarn  

---

### 🖥️ Local Development

#### Frontend Setup

```bash
git clone https://github.com/yourusername/fixify.git
cd fixify
npm install
npm run dev
```

#### Backend Setup

```bash
cd Back-End
npm install
# Create a .env file with appropriate variables
npm run dev
```

---

## 🌍 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fixify
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/service-needers/login`  
- `POST /api/service-needers/register`  
- `POST /api/service-providers/login`  
- `POST /api/service-providers/register`  

### Service Providers
- `GET /api/service-providers`  
- `GET /api/service-providers/:id`  
- `PUT /api/service-providers/:id`  
- `GET /api/service-providers/by-service/:serviceType`  

### Service Requests
- `POST /api/service-requests`  
- `GET /api/service-requests/:id`  
- `PUT /api/service-requests/:id/status`  
- `GET /api/service-requests/customer/:customerId`  
- `GET /api/service-requests/provider/:providerId`  

### Admin
- `GET /api/admin/dashboard`  
- `GET /api/admin/users`  
- `PUT /api/admin/providers/:id/verify`  
- `GET /api/admin/service-requests`  

---

## 🔔 Socket.IO Events

- `requestOTP`  
- `verifyOTP`  
- `serviceRequestCreated`  
- `serviceRequestUpdated`  
- `newMessage`  
- `typing`  

---

## 🤝 Contributing

1. Fork the repo  
2. Create a branch: `git checkout -b feature/your-feature`  
3. Commit: `git commit -m 'Add some feature'`  
4. Push: `git push origin feature/your-feature`  
5. Open a Pull Request  

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- React Icons  
- Socket.IO  
- Framer Motion  
- MongoDB Atlas  
- Netlify and Railway for deployment  
