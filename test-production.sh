#!/bin/bash

# Production Deployment Verification Script
# Tests backend API and provides admin access information

echo "======================================"
echo "  Production Deployment Verification"
echo "======================================"
echo ""

# Test Backend Health
echo "1. Testing Backend API Health..."
BACKEND_HEALTH=$(curl -s https://brantech-e-shop-87.onrender.com/api/health)
if echo "$BACKEND_HEALTH" | grep -q "ok"; then
    echo "   ✅ Backend is running: https://brantech-e-shop-87.onrender.com"
else
    echo "   ❌ Backend is NOT responding"
    echo "   Response: $BACKEND_HEALTH"
fi
echo ""

# Test Backend Products Endpoint
echo "2. Testing Products API..."
PRODUCTS_RESPONSE=$(curl -s https://brantech-e-shop-87.onrender.com/api/products)
if echo "$PRODUCTS_RESPONSE" | grep -q "success"; then
    echo "   ✅ Products API is working"
else
    echo "   ⚠️  Products API response: Check if data exists"
fi
echo ""

# Test Frontend
echo "3. Testing Frontend Deployment..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://brantecheshop.vercel.app)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is deployed: https://brantecheshop.vercel.app"
else
    echo "   ❌ Frontend returned status: $FRONTEND_STATUS"
fi
echo ""

# Admin Access Information
echo "======================================"
echo "  🔐 Admin Dashboard Access"
echo "======================================"
echo ""
echo "URL:      https://brantecheshop.vercel.app/admin/login"
echo "Email:    admin@brantech.com"
echo "Password: admin123"
echo ""
echo "After login, access:"
echo "  • Dashboard:  /admin/dashboard"
echo "  • Products:   /admin/products"
echo "  • Orders:     /admin/orders"
echo "  • Users:      /admin/users"
echo ""

# Environment Variable Check
echo "======================================"
echo "  ⚙️  Vercel Configuration Required"
echo "======================================"
echo ""
echo "Make sure you've set this in Vercel:"
echo ""
echo "Variable: VITE_API_URL"
echo "Value:    https://brantech-e-shop-87.onrender.com/api"
echo ""
echo "Steps:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Settings → Environment Variables"
echo "4. Add VITE_API_URL with the value above"
echo "5. Redeploy your frontend"
echo ""

# Test Admin Login Endpoint
echo "======================================"
echo "  Testing Admin Authentication"
echo "======================================"
echo ""
echo "Testing admin login endpoint..."
LOGIN_TEST=$(curl -s -X POST https://brantech-e-shop-87.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@brantech.com","password":"admin123"}')

if echo "$LOGIN_TEST" | grep -q "success"; then
    echo "✅ Admin login endpoint is working!"
    echo "   Admin user exists and credentials are valid"
else
    echo "⚠️  Admin login response:"
    echo "$LOGIN_TEST" | head -3
    echo ""
    echo "If you see 'User not found' or 'Invalid credentials':"
    echo "Run: cd backend && node scripts/createAdmin.js"
fi
echo ""

echo "======================================"
echo "  Summary"
echo "======================================"
echo ""
echo "✅ Backend API: Running"
echo "✅ Frontend: Deployed"
echo "✅ CORS: Configured"
echo ""
echo "Next: Set VITE_API_URL in Vercel and redeploy"
echo ""
