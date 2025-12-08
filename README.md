# Brantech E-Shop - MERN Stack E-Commerce Platform

Complete MERN (MongoDB, Express, React, Node.js) stack e-commerce platform with admin dashboard, payment integration, and modern UI.

## 🏗️ Project Structure

```
brantech-e-shop-87/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/              # Node.js + Express + MongoDB
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── setup.sh             # Automated setup script
├── start.sh             # Start both servers
└── MERN_SETUP.md        # Detailed setup guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd brantech-e-shop-87
```

2. **Run automated setup**
```bash
chmod +x setup.sh start.sh
./setup.sh
```

3. **Configure environment variables**

Backend (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brantech-shop
JWT_SECRET=your_secure_secret_key
CLIENT_URL=http://localhost:5173
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the application**
```bash
./start.sh
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📱 Features

### Customer Features
- ✅ User authentication & registration
- ✅ Product browsing with filters
- ✅ Shopping cart & wishlist
- ✅ Secure checkout
- ✅ Order tracking
- ✅ Product reviews
- ✅ Multiple payment methods (M-Pesa, Stripe, Cash)

### Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management & tracking
- ✅ Customer management
- ✅ Sales analytics
- ✅ Settings configuration
- ✅ Stock management

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api`

**Authentication**
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

**Products**
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

**Orders**
- `POST /orders` - Create order
- `GET /orders` - Get all orders (admin)
- `GET /orders/myorders` - Get user orders
- `PUT /orders/:id` - Update order status (admin)

**Payments**
- `POST /payment/mpesa/initiate` - M-Pesa payment
- `POST /payment/stripe/create-intent` - Stripe payment

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- TanStack Query
- React Router
- Shadcn/ui + Tailwind CSS
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Cloudinary (image uploads)
- Stripe & M-Pesa integration

## 📖 Documentation

- [MERN Setup Guide](./MERN_SETUP.md) - Detailed setup instructions
- [Admin Dashboard](./ADMIN_DASHBOARD.md) - Admin features documentation

## 🔐 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS protection

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd backend
npm start
```

### Database (MongoDB Atlas)
Update `MONGODB_URI` in backend/.env with Atlas connection string

## 📝 Environment Variables

### Backend Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL

### Backend Optional
- `CLOUDINARY_*` - Image upload credentials
- `STRIPE_SECRET_KEY` - Stripe integration
- `MPESA_*` - M-Pesa integration credentials

### Frontend Required
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Brandon - [Brandon05-dev](https://github.com/Brandon05-dev)

## 🙏 Acknowledgments

- Shadcn/ui for beautiful components
- TanStack Query for data management
- MongoDB for database
- All open source contributors

---

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:5000  
**Admin Dashboard:** http://localhost:5173/admin

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
