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
 * GET /users/reviewed/flights
 * Get reviewed flights for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/flights', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const flights = await Flights.find(filter).sort({ updatedAt: -1 });
    res.json(flights);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/reviewed/hotels
 * Get reviewed hotel bookings for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/hotels', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const hotels = await HotelBooking.find(filter).sort({ updatedAt: -1 });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/reviewed/cartrips
 * Get reviewed car trips for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/cartrips', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const carTrips = await CarTrip.find(filter).sort({ updatedAt: -1 });
    res.json(carTrips);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/reviewed/visa
 * Get reviewed visa applications for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/visa', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { email: user.email }
      ]
    };

    const visas = await Visa.find(filter).sort({ updatedAt: -1 });
    res.json(visas);
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
    const { name, email, number, role, permissions, clientInfo, workStatus } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (number !== undefined) user.number = number;
    if (role !== undefined) user.role = role;
    if (permissions !== undefined) user.permissions = permissions;
    if (clientInfo !== undefined) user.clientInfo = clientInfo;
    if (workStatus !== undefined) user.workStatus = workStatus;

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
 * Queries both by userId (new bookings) and userEmail (existing bookings)
 */
router.get('/:id/summary', authorize(PERMISSIONS.MANAGE_USERS), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { start, end } = req.query;

    const now = new Date();
    const defaultStartOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = start ? new Date(String(start)) : defaultStartOfMonth;
    const endDate = end ? new Date(String(end)) : now;

    // Query by both userId (new bookings) OR userEmail (existing bookings)
    const filter = {
      status: 'reviewed',
      updatedAt: {
        $gte: startDate,
        $lte: endDate
      },
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const visaFilter = {
      status: 'reviewed',
      updatedAt: {
        $gte: startDate,
        $lte: endDate
      },
      $or: [
        { userId: user._id },
        { email: user.email }
      ]
    };

    const BookedPrograms = require('../models/BookedPrograms');
    const BookedCruisies = require('../models/BookedCruseies');

    const [
      reviewedFlightsCount,
      reviewedHotelsCount,
      reviewedCarsCount,
      reviewedVisasCount,
      reviewedProgramsCount,
      reviewedCruisesCount
    ] = await Promise.all([
      Flights.countDocuments(filter),
      HotelBooking.countDocuments(filter),
      CarTrip.countDocuments(filter),
      Visa.countDocuments(visaFilter),
      BookedPrograms.countDocuments(filter),
      BookedCruisies.countDocuments(filter)
    ]);

    res.json({
      reviewedFlightsCount,
      reviewedHotelsCount,
      reviewedCarsCount,
      reviewedVisasCount,
      reviewedProgramsCount,
      reviewedCruisesCount
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/reviewed/programs
 * Get reviewed program bookings for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/programs', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const BookedPrograms = require('../models/BookedPrograms');
    const programs = await BookedPrograms.find(filter).sort({ updatedAt: -1 }).populate("program");
    res.json(programs);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/reviewed/cruises
 * Get reviewed cruise bookings for a user by ID or email (for backward compatibility)
 */
router.get('/reviewed/cruises', authMiddleware, async (req, res, next) => {
  try {
    const { userId, start, end } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }

    // Find user to get email for backward compatibility
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const dateFilter = {};
    if (start || end) {
      if (start) dateFilter.$gte = new Date(String(start));
      if (end) dateFilter.$lte = new Date(String(end));
    }

    const filter = {
      status: 'reviewed',
      ...(Object.keys(dateFilter).length && { updatedAt: dateFilter }),
      $or: [
        { userId: user._id },
        { userEmail: user.email }
      ]
    };

    const BookedCruisies = require('../models/BookedCruseies');
    const cruises = await BookedCruisies.find(filter).sort({ updatedAt: -1 }).populate("cruise");
    res.json(cruises);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
