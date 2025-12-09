import Product from '../models/Product.js';

/**
 * @desc    Get all products (admin view with pagination)
 * @route   GET /api/admin/products
 * @access  Private (Admin)
 */
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || Infinity;

    // Build search query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    query.price = { $gte: minPrice, $lte: maxPrice };

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    console.log(`✅ Fetched ${products.length} products for admin (page ${page})`);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasMore: page * limit < total
        }
      }
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/admin/products
 * @access  Private (Admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
      image,
      images,
      specifications,
      featured,
      tags
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, brand'
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      category,
      brand,
      stock: stock || 0,
      image: image || 'https://via.placeholder.com/400',
      images: images || [],
      specifications: specifications || {},
      featured: featured || false,
      tags: tags || []
    });

    console.log(`✅ Product created: ${product.name} (ID: ${product._id})`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    const allowedUpdates = [
      'name',
      'description',
      'price',
      'originalPrice',
      'category',
      'brand',
      'stock',
      'image',
      'images',
      'specifications',
      'featured',
      'tags'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    console.log(`✅ Product updated: ${product.name} (ID: ${product._id})`);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    console.log(`✅ Product deleted: ${product.name} (ID: ${product._id})`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

/**
 * @desc    Bulk update product stock
 * @route   PUT /api/admin/products/bulk/stock
 * @access  Private (Admin)
 */
export const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, stock }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of product updates'
      });
    }

    const bulkOperations = updates.map(({ id, stock }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { stock } }
      }
    }));

    const result = await Product.bulkWrite(bulkOperations);

    console.log(`✅ Bulk updated ${result.modifiedCount} products`);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} products`,
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('❌ Bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update products',
      error: error.message
    });
  }
};
