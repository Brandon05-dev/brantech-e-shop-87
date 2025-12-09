import Order from '../models/Order.js';

/**
 * @desc    Get all orders (admin view with pagination)
 * @route   GET /api/admin/orders
 * @access  Private (Admin)
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const status = req.query.status || '';
    const search = req.query.search || '';

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } }
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    console.log(`✅ Fetched ${orders.length} orders for admin (page ${page})`);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasMore: page * limit < total
        }
      }
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/admin/orders/:id
 * @access  Private (Admin)
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private (Admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;

    // Set timestamps based on status
    if (status === 'processing' && !order.processingAt) {
      order.processingAt = new Date();
    } else if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
      
      // Calculate estimated delivery (5 business days from ship date)
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
      order.estimatedDelivery = estimatedDelivery;
    } else if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
      order.isPaid = true; // Mark as paid when delivered
    } else if (status === 'cancelled') {
      order.cancelledAt = new Date();
    }

    await order.save();

    console.log(`✅ Order status updated: ${order.orderNumber} -> ${status}`);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

/**
 * @desc    Update order shipping info
 * @route   PUT /api/admin/orders/:id/shipping
 * @access  Private (Admin)
 */
export const updateOrderShipping = async (req, res) => {
  try {
    const { courierService, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update shipping info
    if (courierService) order.courierService = courierService;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);

    await order.save();

    console.log(`✅ Order shipping updated: ${order.orderNumber}`);

    res.status(200).json({
      success: true,
      message: 'Order shipping information updated successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Update shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping information',
      error: error.message
    });
  }
};

/**
 * @desc    Update payment status
 * @route   PUT /api/admin/orders/:id/payment
 * @access  Private (Admin)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { isPaid, paidAt } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.isPaid = isPaid;
    if (isPaid && !order.paidAt) {
      order.paidAt = paidAt ? new Date(paidAt) : new Date();
    }

    await order.save();

    console.log(`✅ Order payment status updated: ${order.orderNumber} -> ${isPaid ? 'Paid' : 'Unpaid'}`);

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/admin/orders/:id
 * @access  Private (Admin)
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();

    console.log(`✅ Order deleted: ${order.orderNumber}`);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

/**
 * @desc    Get order statistics
 * @route   GET /api/admin/orders/stats
 * @access  Private (Admin)
 */
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('❌ Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
};
