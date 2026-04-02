const express = require('express');
const User = require('../models/Users');
const Flights = require('../models/Flights');
const HotelBooking = require('../models/HotelBooking');
const CarTrip = require('../models/CarsTrips');
const Visa = require('../models/Visa');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');
const { isOwnerOrAdmin } = require('../utils/permission');
const PERMISSIONS = require('../config/permissions');

const router = express.Router();

// Apply authMiddleware to all routes logically belonging to users
router.use(authMiddleware);

/**
 * GET /users
 * Get all users
 */
router.get('/', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/:id
 * Get specific user. Allowed for the user themselves or admin with MANAGE_USERS permission.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!isOwnerOrAdmin(req.user, user._id)) {
      return res.status(403).json({ error: "Forbidden: You don't have permission to view this user" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /users
 * Create new user. Admin with MANAGE_USERS can create heads, admins, etc.
 */
router.post('/', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const { name, email, password, number, role, permissions, clientInfo } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const newUser = new User({
      name,
      email,
      password,
      number,
      role: role || 'user',
      permissions: permissions || [],
      clientInfo
    });

    await newUser.save();
    
    // Convert to object and obscure password
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /users/:id
 * Update an existing user. Requires MANAGE_USERS permission.
 */
router.put('/:id', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const { name, email, number, role, permissions, clientInfo } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (number !== undefined) user.number = number;
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;
    if (clientInfo !== undefined) user.clientInfo = clientInfo;

    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /users/:id
 * Delete user. Requires MANAGE_USERS.
 */
router.delete('/:id', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/:id/summary
 * Returns counts of reviewed resources for a user.
 * Requires MANAGE_USERS.
 */
router.get('/:id/summary', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const email = user.email;
    const { start, end } = req.query;

    const now = new Date();
    const defaultStartOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = start ? new Date(String(start)) : defaultStartOfMonth;
    const endDate = end ? new Date(String(end)) : now;

    const filter = {
      userEmail: email,
      status: 'reviewed',
      updatedAt: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const [
      reviewedFlightsCount,
      reviewedHotelsCount,
      reviewedCarsCount,
      reviewedVisasCount
    ] = await Promise.all([
      Flights.countDocuments(filter),
      HotelBooking.countDocuments(filter),
      CarTrip.countDocuments(filter),
      Visa.countDocuments({
        email: email,
        status: 'reviewed',
        updatedAt: filter.updatedAt
      })
    ]);

    res.json({
      reviewedFlightsCount,
      reviewedHotelsCount,
      reviewedCarsCount,
      reviewedVisasCount
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
