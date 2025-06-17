# 🧑‍💼 D-Talk Internship Platform

A full-stack web application built for D-Talk to manage internships, monitor student progress, and facilitate communication between instructors and interns. The platform supports real-time task assignments and comments via WebSockets, features a modern UI with TailwindCSS, and runs on a scalable backend using Node.js, Express, MySQL, and Prisma ORM.

## 📦 Tech Stack

### Frontend
- ⚛️ **React** - Modern JavaScript library for building user interfaces
- 🔄 **Redux** - Predictable state container for JavaScript apps
- 💨 **TailwindCSS** - Utility-first CSS framework for rapid UI development
- 🌐 **WebSocket Client** - Real-time communication with the server

### Backend
- 🚀 **Node.js** - JavaScript runtime for server-side development
- 🧩 **Express.js** - Fast, unopinionated web framework for Node.js
- 🔌 **WebSocket** - Native WebSocket for real-time bidirectional communication
- 🧬 **Prisma ORM** - Modern database toolkit and ORM
- 🐬 **MySQL** - Relational database management system
- 📧 **Nodemailer** - Email sending functionality
- 🛡️ **Helmet** - Security middleware for Express
- 📁 **Multer** - File upload handling middleware

### DevOps & Tools
- 🐳 **Docker Compose** - Multi-container Docker application orchestration

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Docker & Docker Compose**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/hamzabenarfa/d-talk-internship.git
cd d-talk-internship
```

### 2. Environment Setup

Create `.env` files in both frontend and backend directories:

**Backend `.env`**
```env
# Database Configuration
DATABASE_URL="mysql://dtalk_user:secure_password@localhost:3306/dtalk_db"

# Server Configuration
PORT=4000

# CORS & Client
CLIENT_URL=http://localhost:3000

# JWT Secret (generate a secure one)
JWT_SECRET=your_super_secure_jwt_secret_key

# WebSocket Configuration
SOCKET_PORT=8081
```

**Frontend `.env`**
```env
# API Configuration
WEB_SOCKET_URL=http://localhost:8081
```

### 3. Docker Compose Setup
```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Database Migration
```bash
# Navigate to backend directory
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed the admin account
npx prisma db admin

# Optional: Seed the database
npx prisma db seed

# Open Prisma Studio (Database GUI)
npx prisma studio
```


---

## ✨ Features

### 🎯 Core Functionality
- ✅ **Internship Listings** - Browse and search internship opportunities
- ✅ **Company Profiles** - Detailed company information and job postings
- ✅ **User Authentication** - Secure login/register for students and companies
- ✅ **Application Management** - Track and manage internship applications
- ✅ **Real-time Notifications** - Instant updates via WebSockets

### 🎨 User Experience
- ✅ **Responsive Design** - Mobile-first approach with TailwindCSS
- ✅ **Modern UI Components** - Clean, professional interface
- ✅ **Advanced Filtering** - Search by location, company, skills, etc.
- ✅ **Dashboard Analytics** - Statistics and insights for companies

### 🔧 Technical Features
- ✅ **RESTful API** - Well-structured backend API
- ✅ **Database Relations** - Optimized MySQL schema with Prisma
- ✅ **File Upload** - Resume and company logo upload functionality
- ✅ **Email Integration** - Automated notifications and confirmations

---

## 🛠️ Development

### Backend Commands
```bash
cd backend

# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Database operations
npm run db:migrate     # Run migrations
npm run db:seed       # Seed database
npm run db:reset      # Reset database
npm run db:studio     # Open Prisma Studio
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build
```

### Docker Commands
```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```


## 🔒 Security & Best Practices

### Authentication & Authorization
- ✅ **JWT Tokens** for secure authentication
- ✅ **Password Hashing** using bcrypt
- ✅ **Role-based Access Control** (Student, Instructor, Admin)
- ✅ **Protected Routes** on both frontend and backend

### Data Security
- ✅ **Input Validation** using yup schemas
- ✅ **SQL Injection Prevention** via Prisma ORM
- ✅ **XSS Protection** with proper sanitization
- ✅ **CORS Configuration** for allowed origins only

### Performance & Reliability
- ✅ **Rate Limiting** on API endpoints
- ✅ **Database Indexing** for optimized queries
- ✅ **Error Handling** with proper logging
- ✅ **Request Compression** with gzip

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team & Contact

**Lead Developer**: Hamza Benarfa
- 📧 Email: hamzabenarfa4@gmail.com benarfahamza@d-talk.co
- 📧 Email: benarfahamza@d-talk.co
- 💼 LinkedIn: [linkedin.com/in/hamza-benarfa](https://linkedin.com/in/hamzabenarfa)
- 🐙 GitHub: [@hamza-benarfa](https://github.com/hamzabenarfa)

**Project Repository**: [github.com/hamza-benarfa/dtalk-internships](https://github.com/hamza-benarfa/d-talk-internship)

---

## 🙏 Acknowledgments

- **D-Talk Team** for project vision and requirements
- **Open Source Community** for amazing tools and libraries

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [TailwindCSS Guide](https://tailwindcss.com/docs)
- [React Best Practices](https://react.dev/learn)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

*Built with ❤️ for connecting talent with opportunities*

![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>
