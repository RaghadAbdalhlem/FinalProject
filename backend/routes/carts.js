const { default: mongoose } = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const { Cart } = require('../models/Cart');
const { Order } = require('../models/Order');

const router = require('express').Router();

router.post('/create', authMiddleware(['admin', 'user', 'content-manager']), async (req, res) => {
  const { product, quantity } = req.body;
  const userId = req.user._id;
  try {
      await Cart.create({
          product: product,
          user: userId,
          quantity: quantity
      });
      return res.status(200).send({ status: "success", message: "Cart data created successfully!" });
  } catch (error) {
      return res.status(500).send({ status: "error", message: error.message });
  }
});

router.get('/mycart', authMiddleware(['admin', 'user', 'content-manager']), async (req, res) => {
  const myCarts = await Cart.find({ user: new mongoose.Types.ObjectId(req.user._id), status: 'active' })
      .populate({
          path: 'user',
          select: {
              _id: 1, fullName: 1, email: 1, role: 1,
          },
      })
      .populate({ 
          path: 'product',
          select: {
              _id: 1, title: 1, category: 1, usageInstructions: 1, price: 1, image: 1,
          },
      }).select('-__v');

  return res.send(myCarts);
});

router.post('/checkout', authMiddleware(['admin', 'user', 'content-manager']), async (req, res) => {
  const postCheckoutData = req.body;
  let cartIds = postCheckoutData.map(checkData => new mongoose.Types.ObjectId(checkData.cart));
  try {
      await Cart.updateMany({ _id: { $in: cartIds } }, { $set: { status: "deleted" } }, { new: true });
      await Order.insertMany(postCheckoutData);
      return res.send({ status: "success", message: "Checkout successfully!" });
  } catch (error) {
      return res.send({ status: "error", message: error.message });
  }
});

router.delete('/delete/:id', authMiddleware(['admin', 'user', 'content-manager']), async (req, res) => {
  try {
      await Cart.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, { status: 'deleted' }, { new: true });
      return res.send({ status: "success", message: "The Cart data deleted successfully!" });
  } catch (error) {
      return res.send({ status: "error", message: error.message });
  }
});

module.exports = router;