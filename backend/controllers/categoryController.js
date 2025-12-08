export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'smartphones', name: 'Smartphones', icon: 'smartphone' },
      { id: 'laptops', name: 'Laptops', icon: 'laptop' },
      { id: 'audio', name: 'Audio', icon: 'headphones' },
      { id: 'gaming', name: 'Gaming', icon: 'gamepad' },
      { id: 'accessories', name: 'Accessories', icon: 'cable' },
      { id: 'wearables', name: 'Wearables', icon: 'watch' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
