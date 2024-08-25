const Product = require('../models/productModel')
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;
  
      const keyword = req.query.keyword
        ? { $or : [ {name: { $regex: req.query.keyword, $options: 'i' }},
             {category: { $regex: req.query.keyword, $options: 'i' }},
             {brand: { $regex: req.query.keyword, $options: 'i' }},
             {description: { $regex: req.query.keyword, $options: 'i' }} ]}
        : {};
  
      const category = req.query.category ? { category: {$regex: req.query.category, $options: 'i' } } : {};
      const brand = req.query.brand ? { brand:  { $regex: req.query.brand, $options: 'i'  }} : {};
  
      let minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
      let maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;
  
      // Ensure that the upper limit of the price range is exclusive
      maxPrice = maxPrice === Infinity ? maxPrice : maxPrice - 0.01;
  
      const priceRange = { price: { $gte: minPrice, $lte: maxPrice } };
  
      const rating = req.query.rating && Number(req.query.rating) >= 0 && Number(req.query.rating) <= 5
        ? { rating: { $gte: req.query.rating } }
        : {};
  
      let sortOrder = {};
      if (req.query.sortBy) {
        if (req.query.sortBy === 'priceAsc') sortOrder = { price: 1 };
        if (req.query.sortBy === 'priceDesc') sortOrder = { price: -1 };
        if (req.query.sortBy === 'rating') sortOrder = { rating: -1 };
      }
  
      const count = await Product.countDocuments({ ...keyword,  ...category,  ...brand,  ...priceRange,  ...rating,});
  
      const products = await Product.find({ ...keyword,  ...category,  ...brand,  ...priceRange,  ...rating, })
        .sort(sortOrder)
        .limit(pageSize)
        .skip(pageSize * (page - 1));
  
      res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

// @desc    Fetch single product
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res)=>{
    try {
        const products = await Product.find({}).sort({rating: -1}).limit(3)
        res.status(200).json(products)
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  // Validate input
  if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
  }
  if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
          return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
    getProducts,
    getTopProducts,
    getProductById,
    createProductReview
}