# Admin Dashboard Management System

A comprehensive admin dashboard management system for Brantech E-Shop with real-time monitoring, analytics, and complete store management capabilities.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Live revenue, orders, products, and customer metrics
- **Order Status Overview**: Visual tracking of pending, processing, shipped, and delivered orders
- **Revenue Charts**: Interactive monthly revenue trends with hover tooltips
- **Recent Orders**: Quick view of the latest customer orders
- **Top Products**: Best-selling items with performance metrics
- **Low Stock Alerts**: Automated alerts for products running low
- **Time Range Filters**: View data for 7 days, 30 days, 90 days, or 1 year
- **Data Export**: Export dashboard data for reporting
- **Auto-refresh**: Real-time data updates

### 📦 Products Management
- **Product Listing**: View all products with search and category filters
- **Add/Edit Products**: Complete product management with:
  - Name, description, and specifications
  - Pricing and discount management
  - Stock tracking
  - Category and brand assignment
  - Featured and bestseller flags
  - Image uploads
- **Bulk Actions**: Delete multiple products
- **Stock Alerts**: Visual indicators for low stock items

### 🛍️ Orders Management
- **Order Tracking**: Complete order lifecycle management
- **Status Updates**: Update order status (pending, paid, processing, shipped, delivered, cancelled)
- **Order Details**: View customer information, items ordered, and payment details
- **Search & Filter**: Find orders by order number, customer name, or email
- **Status Filtering**: Filter orders by their current status
- **Order Statistics**: Quick stats on order distribution

### 👥 Customers Management
- **Customer Database**: View all registered customers
- **Customer Insights**:
  - Total customers and new registrations
  - Repeat buyers tracking
  - Customer loyalty points
- **Customer Details**:
  - Contact information
  - Order history
  - Total spending
  - Join date
- **Customer Actions**: View details and manage accounts

### 📈 Analytics
- **Revenue Analytics**:
  - Monthly revenue trends
  - Year-over-year comparisons
  - Growth percentages
- **Sales Analytics**:
  - Category-wise sales breakdown
  - Top-performing categories
  - Sales distribution charts
- **Traffic Analytics**:
  - Traffic sources breakdown
  - Visitor statistics
  - Conversion tracking
- **Key Metrics**:
  - Total revenue with trends
  - Order count and growth
  - Conversion rates
  - Average order value

### ⚙️ Settings
- **Store Information**:
  - Store name, email, phone
  - Business address
  - Store description
- **Notification Settings**:
  - Email notifications toggle
  - Order alerts
  - Low stock alerts
  - Customer notifications
- **Payment Methods**:
  - M-Pesa integration
  - Card payment options
  - Cash on delivery
- **Shipping & Tax**:
  - Tax rate configuration
  - Standard shipping fees
  - Free shipping thresholds
- **Security**:
  - Password management
  - Two-factor authentication

## User Interface

### Design Features
- **Light Mode**: Clean, professional light theme
- **Glass Card Effects**: Modern glassmorphism design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Collapsible Sidebar**: Space-efficient navigation
- **Interactive Charts**: Hover tooltips and animations
- **Color-Coded Status**: Visual status indicators
- **Toast Notifications**: User feedback for actions

### Navigation
- **Quick Access Sidebar**: Always-accessible menu
- **Breadcrumbs**: Easy navigation tracking
- **Action Buttons**: Context-sensitive actions
- **Search & Filters**: Fast data access

## Technical Implementation

### Technologies Used
- React with TypeScript
- React Router for navigation
- Shadcn UI components
- Tailwind CSS for styling
- Lucide React icons
- Sonner for notifications

### State Management
- React hooks for local state
- Real-time data simulation
- Context providers where needed

### Data Flow
- Mock data from `/src/data/` directory
- Real-time updates simulation
- Persistent settings management

## Usage

### Accessing the Admin Dashboard
1. Navigate to `/admin` in your browser
2. The dashboard loads with real-time statistics
3. Use the sidebar to navigate between sections

### Managing Products
1. Go to **Products** from the sidebar
2. Click **Add Product** to create new items
3. Use the search and filters to find products
4. Click on any product to edit or delete

### Processing Orders
1. Navigate to **Orders**
2. View all orders with their current status
3. Click on an order to see details
4. Update order status as needed
5. Filter by status to focus on specific orders

### Viewing Analytics
1. Open **Analytics** from sidebar
2. View revenue trends and category performance
3. Monitor traffic sources
4. Track conversion rates and key metrics

### Configuring Settings
1. Go to **Settings**
2. Choose the appropriate tab (General, Notifications, Payment, Shipping, Security)
3. Update settings as needed
4. Click **Save Changes**

## Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: React memo and optimization
- **Efficient Data Handling**: Smart filtering and searching
- **Responsive Design**: Mobile-first approach

## Future Enhancements

- Real backend API integration
- Advanced analytics with custom date ranges
- Bulk product operations
- Email template management
- Customer segmentation
- Automated reports
- Role-based access control
- Multi-store management
- Inventory forecasting
- Marketing campaign management

## Support

For issues or questions about the admin dashboard, please refer to the main project documentation.
