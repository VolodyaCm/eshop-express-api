import express from 'express';
import Product from '../models/product.js';
import Category from '../models/category.js';
import { normalizeFilter } from '../helpers/queryParams.js';

const router = express.Router();

router.get(`/`, async (req, res, next) => {
  try {
    const filter = normalizeFilter(req.query.filter);
    const products = await Product.find(filter).select('name image -_id');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false
    })
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    const record = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    }, { new: true });

    res.status(204).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    })
  }
});

router.post('/', async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    const record = await product.save();
    res.status(201).json(record)
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    })
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    })
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({
      count: productCount
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    })
  }
})

router.get('/get/featured', async (req, res) => {
  const { limit = 12, offset = 0 } = req.query;
  try {
    const products = await Product.find({ isFeatured: true })
      .skip(+offset)
      .limit(+limit);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    })
  }
});

export default router;
