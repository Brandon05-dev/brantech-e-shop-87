# Production Deployment Guide

## Live URLs

- **Frontend:** https://brantecheshop.vercel.app
- **Backend API:** https://brantech-e-shop-87.onrender.com
- **Admin Dashboard:** https://brantecheshop.vercel.app/admin/login

## Admin Access

**Admin Login Credentials:**
- Email: `admin@brantech.com`
- Password: `admin123`

**Admin Dashboard URL:**
```
https://brantecheshop.vercel.app/admin/login
```

After logging in, admin can access:
- Dashboard: `/admin/dashboard` - View statistics and metrics
- Products: `/admin/products` - Create, edit, delete products
- Orders: `/admin/orders` - Manage customer orders
- Users: `/admin/users` - Manage user accounts and roles
- Profile: `/admin/profile` - Update profile and change password

## 🔒 Change Default Password

**IMPORTANT:** Change the default password immediately after first login!

1. Login to admin dashboard
2. Click your profile icon (top right)
3. Select "My Profile"
4. Scroll to "Change Password" section
5. Enter current password: `admin123`
6. Enter new secure password (min 6 characters)
7. Confirm new password
8. Click "Change Password"

**Password Security Tips:**
- Use at least 8-12 characters
- Mix uppercase and lowercase letters
- Include numbers and special symbols
- Don't reuse passwords from other sites
- Never share your admin credentials

## Environment Variables Configuration

### Frontend (Vercel)

Set these environment variables in your Vercel project settings:

```
VITE_API_URL=https://brantech-e-shop-87.onrender.com/api
```

**How to set:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `VITE_API_URL` with value `https://brantech-e-shop-87.onrender.com/api`
3. Redeploy your frontend

### Backend (Render)

Ensure these environment variables are set in Render:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
ADMIN_JWT_SECRET=your_secure_admin_jwt_secret_key
ADMIN_JWT_EXPIRE=15m
ADMIN_REFRESH_SECRET=your_secure_refresh_secret_key
ADMIN_REFRESH_EXPIRE=7d
```

**How to set:**
1. Go to Render Dashboard → Your Service → Environment
2. Add each variable with its value
3. The service will automatically redeploy

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:8080` (local development)
- `http://localhost:5173` (Vite default)
- `https://brantecheshop.vercel.app` (production)

## MongoDB Atlas Setup

Ensure your MongoDB Atlas cluster allows connections from:
- Render's IP addresses (add 0.0.0.0/0 to allow all IPs, or whitelist Render IPs)
- Your local machine IP (for development)

**To configure:**
1. Go to MongoDB Atlas → Network Access
2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Or whitelist specific Render IP ranges

## Deployment Steps

### Initial Setup (One-time)

1. **Deploy Backend to Render:**
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add all environment variables

2. **Deploy Frontend to Vercel:**
   - Connect your GitHub repository
   - Vercel auto-detects the configuration from `vercel.json`
   - Add `VITE_API_URL` environment variable
   - Deploy

3. **Create Admin User:**
   - SSH into Render or run locally:
   ```bash
   cd backend
   node scripts/createAdmin.js
   ```

### Updating the Site

**Frontend Changes:**
1. Push changes to GitHub main branch
2. Vercel automatically rebuilds and deploys

**Backend Changes:**
1. Push changes to GitHub main branch
2. Render automatically rebuilds and deploys

**Manual Redeploy:**
- Vercel: Dashboard → Deployments → Redeploy
- Render: Dashboard → Manual Deploy → Deploy latest commit

## Testing Admin Dashboard

1. Visit: https://brantecheshop.vercel.app/admin/login
2. Login with admin credentials
3. Test each section:
   - Dashboard loads with statistics
   - Products page shows/creates products
   - Orders page displays orders
   - Users page shows user management

## Troubleshooting

### Admin can't login
- Check backend is running: https://brantech-e-shop-87.onrender.com/api/health
- Verify CORS is configured correctly
- Check browser console for errors
- Ensure admin user exists in database

### Products not showing
- Check API is accessible
- Verify VITE_API_URL is set correctly in Vercel
- Check browser network tab for failed requests

### 401 Unauthorized errors
- Clear browser cookies
- Login again
- Check JWT secrets are set in backend environment

### CORS errors
- Verify Vercel URL is in backend CORS whitelist
- Check credentials are enabled (credentials: true)
- Ensure cookies are being sent

## Monitoring

- **Backend Logs:** Render Dashboard → Your Service → Logs
- **Frontend Logs:** Vercel Dashboard → Your Project → Deployments → Function Logs
- **Database:** MongoDB Atlas → Clusters → Metrics

## Security Notes

1. **Change Default Admin Password:**
   - Login to admin dashboard
   - Update password immediately

2. **Environment Variables:**
   - Never commit `.env` files to GitHub
   - Use strong, unique values for JWT secrets
   - Rotate secrets periodically

3. **Database:**
   - Use strong MongoDB password
   - Enable IP whitelisting when possible
   - Regular backups

## Support

For issues:
1. Check logs in Render/Vercel dashboards
2. Verify environment variables are set
3. Test API endpoints directly
4. Check MongoDB connection
