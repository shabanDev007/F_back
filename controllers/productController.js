const { Product, ProductSize, ProductColor } = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    console.log('getProducts');
    const products = await Product.findAll({
      include: [
        { model: ProductSize, as: 'sizes' },
        { model: ProductColor, as: 'colors' },
      ],
    });
    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found', data: [] });
    }
    res.status(200).json({ message: 'Products retrieved successfully', data: products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      has_sizes,
      has_colors,
      sizes,
      colors,
      isNew,
      isTrending,
      image,
      sku,
      stock,
    } = req.body;
    // Validate required fields
    if (!name || !price || !category || !sku) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category, and sku are required' });
    }

    // Generate id if not provided
    let id = req.body.id;
    if (!id) {
      const lastProduct = await Product.findOne({
        order: [['id', 'DESC']],
      });
      id = lastProduct ? lastProduct.id + 1 : 1;
    }

    // Parse sizes and colors if provided
    const parsedSizes = has_sizes && sizes ? sizes : [];
    const parsedColors = has_colors && colors ? colors : [];

    // Create product
    const product = await Product.create({
      id,
      name,
      price,
      image: image || null,
      category,
      description: description || null,
      has_sizes: has_sizes || false,
      has_colors: has_colors || false,
      isNew: isNew || false,
      isTrending: isTrending || false,
      sku: sku || null,
      stock: stock !== undefined ? stock : 0,
    });

    // Create associated sizes
    if (has_sizes && parsedSizes.length > 0) {
      const sizesWithProductId = parsedSizes.map(size => ({
        ...size,
        productId: product.id,
      }));
      await ProductSize.bulkCreate(sizesWithProductId);
    }

    // Create associated colors
    if (has_colors && parsedColors.length > 0) {
      const colorsWithProductId = parsedColors.map(color => ({
        ...color,
        productId: product.id,
      }));
      await ProductColor.bulkCreate(colorsWithProductId);
    }

    // Fetch the created product with associations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductSize, as: 'sizes' },
        { model: ProductColor, as: 'colors' },
      ],
    });

    res.status(201).json({ message: 'Product created successfully', data: createdProduct });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      category,
      description,
      has_sizes,
      has_colors,
      sizes,
      colors,
      isNew,
      isTrending,
      image,
      sku,
      stock,
    } = req.body;

    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate required fields
    if (!name || !price || !category || !sku) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category, and sku are required' });
    }

    // Update product
    await product.update({
      name,
      price,
      image: image || null,
      category,
      description: description || null,
      has_sizes: has_sizes || false,
      has_colors: has_colors || false,
      isNew: isNew || false,
      isTrending: isTrending || false,
      sku,
      stock: stock !== undefined ? stock : product.stock,
    });

    // Handle sizes
    if (has_sizes) {
      // Delete existing sizes
      await ProductSize.destroy({ where: { productId: id } });
      // Create new sizes if provided
      if (sizes && sizes.length > 0) {
        const sizesWithProductId = sizes.map(size => ({
          ...size,
          productId: id,
        }));
        await ProductSize.bulkCreate(sizesWithProductId);
      }
    }

    // Handle colors
    if (has_colors) {
      // Delete existing colors
      await ProductColor.destroy({ where: { productId: id } });
      // Create new colors if provided
      if (colors && colors.length > 0) {
        const colorsWithProductId = colors.map(color => ({
          ...color,
          productId: id,
        }));
        await ProductColor.bulkCreate(colorsWithProductId);
      }
    }

    // Fetch the updated product with associations
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: ProductSize, as: 'sizes' },
        { model: ProductColor, as: 'colors' },
      ],
    });

    res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated sizes and colors first
    await ProductSize.destroy({ where: { productId: id } });
    await ProductColor.destroy({ where: { productId: id } });

    // Delete the product
    await Product.destroy({ where: { id } });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};