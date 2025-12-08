# MERN Stack E-Commerce - Brantech Shop

Complete MERN (MongoDB, Express, React, Node.js) stack implementation for the Brantech E-Commerce platform.

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Location**: `/server` directory
- **Database**: MongoDB (local or MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary integration
- **Payment**: Stripe and M-Pesa (Safaricom Daraja API)

### Frontend (React + TypeScript + Vite)
- **Location**: Root directory
- **State Management**: React Context + TanStack Query
- **UI Components**: Shadcn/ui + Tailwind CSS
- **API Communication**: Axios

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Configure your `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/brantech-shop
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Payment integrations
STRIPE_SECRET_KEY=your_stripe_key
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
```

**Start MongoDB:**
```bash
# If using local MongoDB
sudo systemctl start mongod

# Or use MongoDB Atlas cloud database
```

**Run the server:**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Create .env file for frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Models

### User Model
- Authentication & profile management
- Roles: customer, admin
- Wishlist & order history
- Address information

### Product Model
- Product details & specifications
- Categories & brands
- Stock management
- Images & ratings
- Featured & bestseller flags

### Order Model
- Order tracking & management
- Payment information
- Shipping details
- Status workflow

### Review Model
- Product reviews & ratings
- User feedback
- Verified purchase tracking

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get bestsellers

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/myorders` - Get user orders
- `PUT /api/orders/:id` - Update order status (admin)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/product/:productId` - Get product reviews
- `DELETE /api/reviews/:id` - Delete review (admin)

### Payment
- `POST /api/payment/mpesa/initiate` - Initiate M-Pesa payment
- `POST /api/payment/mpesa/callback` - M-Pesa callback
- `POST /api/payment/stripe/create-intent` - Create Stripe payment

### Upload
- `POST /api/upload` - Upload product images (admin)

## 🔐 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage
4. Token sent with each API request
5. Server validates token for protected routes

## 💳 Payment Integration

### M-Pesa (Kenya)
- STK Push integration
- Real-time payment callbacks
- Order status auto-update

### Stripe
- Card payments
- Payment intents
- Secure checkout

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, DigitalOcean)

```bash
# Build command
npm install

# Start command
npm start

# Environment variables
# Set all .env variables in your hosting platform
```

### Frontend Deployment (e.g., Vercel, Netlify)

```bash
# Build command
npm run build

# Output directory
dist

# Environment variables
VITE_API_URL=https://your-api-domain.com/api
```

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update MONGODB_URI in backend .env

## 📱 Features Implemented

### Customer Features
- ✅ User registration & authentication
- ✅ Browse products with filters
- ✅ Product search
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Checkout process
- ✅ Order tracking
- ✅ Product reviews
- ✅ Multiple payment methods

### Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Customer management
- ✅ Order status updates
- ✅ Sales analytics
- ✅ Stock management
- ✅ Settings configuration

## 🧪 Testing

### Test Backend API

```bash
# Install REST client (optional)
npm install -g httpie

# Test health endpoint
http GET http://localhost:5000/api/health

# Test register
http POST http://localhost:5000/api/auth/register \
  name="Test User" \
  email="test@example.com" \
  password="password123"
```

### Test with Postman

Import the API endpoints into Postman and test each route with appropriate authentication tokens.

## 📊 Database Seeding

To populate your database with sample data:

```bash
cd server
npm run seed
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### CORS Issues
- Frontend and backend must be on different ports
- Update CLIENT_URL in backend .env
- Check CORS configuration in server.js

### JWT Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage and re-login

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Stripe API](https://stripe.com/docs/api)
- [Safaricom Daraja API](https://developer.safaricom.co.ke/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push to the branch
5. Create Pull Request

## 📄 License

This project is licensed under the ISC License.
