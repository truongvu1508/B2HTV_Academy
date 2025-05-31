# 🎓 B2HTV Academy

## 👥 Team

**Group 4 - 224ECM01**

Built with ❤️ by passionate developers dedicated to revolutionizing online education.

---

<div align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</div>

<div align="center">
  <h3>🚀 A comprehensive online learning platform built by Team 4</h3>
  <p>Empowering education through modern web technologies</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)
- [👥 Team](#-team)
- [📄 License](#-license)

---

## ✨ Features

### 👨‍🎓 **Student Features**

- 📚 **Course Catalog** - Browse comprehensive course listings
- 🔍 **Smart Search** - Find courses with advanced search functionality
- 🏷️ **Category Filtering** - Filter courses by categories and topics
- 📖 **Course Details** - Detailed course information with previews
- 💳 **Secure Checkout** - Purchase courses with Stripe integration
- 🎥 **Learning Experience** - Interactive video-based learning
- ⭐ **Course Rating** - Rate and review completed courses

### 👨‍💼 **Admin Features**

- 📊 **Analytics Dashboard** - Comprehensive business insights
  - Student enrollment statistics by category/course
  - Revenue analytics (monthly, quarterly, yearly)
  - Recent student registration tracking
  - Course revenue breakdown
- 🗂️ **Category Management** - Full CRUD operations for course categories
- 📚 **Course Management** - Complete course lifecycle management
  - Create/Edit courses with chapters and lectures
  - Free preview content configuration
  - Video content management
- 👥 **Student Management** - Track students by category and course
- 💼 **Account Management** - Monitor student spending and engagement

---

## 🛠️ Tech Stack

### **Frontend**

- ⚡ **Vite + React** - Lightning-fast development and build
- 🎨 **UI/UX Libraries:**
  - Ant Design - Enterprise-grade UI components
  - React Icons - Beautiful icon library
  - Tailwind CSS - Utility-first styling
- 📊 **Data Visualization:**
  - Ant Design Charts - Interactive charts and graphs
  - TanStack Table - Powerful data tables
- 🔐 **Authentication:** Clerk - Modern user management
- 🎬 **Media & Interactions:**
  - React YouTube - Video player integration
  - AOS - Smooth animations
  - React Toastify - Beautiful notifications
  - Quill - Rich text editor

### **Backend**

- 🟢 **Node.js + Express.js** - Robust server framework
- 🔐 **Authentication:** Clerk Express integration
- ☁️ **File Storage:** Cloudinary - Media management
- 💳 **Payments:** Stripe - Secure payment processing
- 🔄 **Webhooks:** Svix - Reliable webhook handling

### **Database**

- 🍃 **MongoDB Atlas** - Cloud-hosted NoSQL database
- 🔗 **ODM:** Mongoose - Elegant object modeling

### **Development Tools**

- 📦 **Package Management:** npm
- 🔄 **Development:** Nodemon - Auto-restart server
- 🧹 **Code Quality:** ESLint - Code linting
- 🎨 **Styling:** PostCSS + Autoprefixer

---

## 🏗️ Architecture

```
📁 B2HTV Academy
├── 📂 client/                 # Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 components/     # Reusable UI components
│   │   ├── 📂 pages/          # Application pages
│   │   ├── 📂 hooks/          # Custom React hooks
│   │   ├── 📂 utils/          # Utility functions
│   │   └── 📂 styles/         # Global styles
│   └── 📄 package.json
├── 📂 server/                 # Backend Application
│   ├── 📂 models/             # Database models
│   ├── 📂 routes/             # API routes
│   ├── 📂 controllers/        # Business logic
│   ├── 📂 middleware/         # Custom middleware
│   └── 📄 package.json
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account for authentication
- Stripe account for payments
- Cloudinary account for media storage

<!-- ### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-team/b2htv-academy.git
   cd b2htv-academy
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   ```

   Create `.env` file:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```

   Create `.env` file:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start Development Servers**

   Backend:

   ```bash
   cd server
   npm run server
   ```

   Frontend:

   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

--- -->

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/4f46e5/ffffff?text=Course+Catalog" alt="Course Catalog" />
  <p><em>📚 Modern course catalog with search and filtering</em></p>
</div>

<div align="center">
  <img src="https://via.placeholder.com/800x400/059669/ffffff?text=Admin+Dashboard" alt="Admin Dashboard" />
  <p><em>📊 Comprehensive admin dashboard with analytics</em></p>
</div>

---

## 🎯 Key Highlights

- 🔐 **Secure Authentication** - Powered by Clerk
- 💳 **Seamless Payments** - Integrated with Stripe
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Optimized with Vite
- 📊 **Rich Analytics** - Detailed business insights
- 🎥 **Interactive Learning** - Engaging video content
- 🌟 **Modern UI/UX** - Beautiful and intuitive interface

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <h3>🌟 Star us on GitHub if you find this project helpful!</h3>
  <p>Made with 💻 and ☕ by Team 4</p>
</div>
