import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      total
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify product availability and prices
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      total
    });

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Make sure user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    // Generate order timeline based on status
    const timeline = generateOrderTimeline(order);

    res.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
        status: order.status,
        items: order.items,
        totalAmount: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.isPaid ? 'paid' : 'pending',
        shippingAddress: order.shippingAddress,
        customer: {
          name: order.user.name,
          email: order.user.email
        },
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        timeline
      }
    });
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Helper function to generate order timeline
const generateOrderTimeline = (order) => {
  const timeline = [
    {
      status: 'pending',
      message: 'Order placed successfully',
      date: order.createdAt
    }
  ];

  if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({
      status: 'processing',
      message: 'Order is being processed',
      date: order.updatedAt
    });
  }

  if (order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({
      status: 'shipped',
      message: order.trackingNumber 
        ? `Package shipped with tracking number ${order.trackingNumber}` 
        : 'Package has been shipped',
      date: order.shippedAt || order.updatedAt
    });
  }

  if (order.status === 'delivered') {
    timeline.push({
      status: 'delivered',
      message: 'Package delivered successfully',
      date: order.deliveredAt || order.updatedAt
    });
  }

  if (order.status === 'cancelled') {
    timeline.push({
      status: 'cancelled',
      message: 'Order has been cancelled',
      date: order.updatedAt
    });
  }

  return timeline;
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;
    
    if (req.body.status === 'paid') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    
    if (req.body.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track order by order number (Public)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Find by order number or by ID
    let order = await Order.findOne({ orderNumber })
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      // Try finding by ID as fallback
      order = await Order.findById(orderNumber)
        .populate('user', 'name email')
        .populate('items.product', 'name image price');
    }

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found. Please check your order number and try again.' 
      });
    }

    // Generate order timeline
    const timeline = generateOrderTimeline(order);

    console.log('📦 Order tracked:', orderNumber);

    res.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        items: order.items,
        totalAmount: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.isPaid ? 'paid' : 'pending',
        shippingAddress: order.shippingAddress,
        customer: {
          name: order.user.name,
          email: order.user.email
        },
        trackingNumber: order.trackingNumber,
        courierService: order.courierService,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        timeline
      }
    });
  } catch (error) {
    console.error('❌ Track order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to track order. Please try again later.' 
    });
  }
};
