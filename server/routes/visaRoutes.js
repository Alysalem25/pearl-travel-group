    const express = require("express");
    const Visa = require("../models/Visa");
    const User = require("../models/Users");
    const authMiddleware = require("../middlewares/authMiddleware");
    const authorize = require("../middlewares/authorizeMiddleware");
    const { handleValidationErrors, validateVisa } = require("../middlewares/validators");
    const { logSuccess, logError } = require("../utils/loggerService");

    const router = express.Router();

    /**
     * POST /visa
     * Submit visa application - PUBLIC ROUTE
     */
    router.post("/", handleValidationErrors, validateVisa, async (req, res, next) => {
        try {
            const {
                fullName,
                email,
                phone, 
                otherCountries,
                destination,
                hasTraveledAbroad,
                visitedCountries
            } = req.body;

            // Validate required fields
            if (!fullName || !email || !phone || !destination) {
                return res.status(400).json({
                    error: "Missing required fields: fullName, email, phone, and destination"
                });
            }

            const visa = new Visa({
                fullName,
                email,
                phone,
                destination ,
                otherCountries: otherCountries || "",
                hasTraveledAbroad: hasTraveledAbroad === true || hasTraveledAbroad === "true",
                visitedCountries: visitedCountries || ""
            });

            await visa.save();
            
            // 🔹 Log create visa action
            const user = await User.findOne({ email });
            if (user) {
                await logSuccess(user._id, "CREATE_VISA", "Visa", visa._id, req, {
                    destination,
                    fullName
                });
            }

            return res.status(201).json({
                message: "Visa application submitted successfully",
                applicationId: visa._id,
                data: visa
            });
        } catch (err) {
            await logError(null, "CREATE_VISA", "Visa", req, err.message, {
                email: req.body.email,
                destination: req.body.destination
            });
            next(err);
        }
    });

    /**
     * GET /visa
     * Get all visa applications - ADMIN ONLY
     */
    router.get("/", authMiddleware, authorize("manage_visa"), async (req, res, next) => {
        try {
            const { status, email, sortBy = "submittedAt", order = "desc" } = req.query;
            let filter = {};

            if (status) filter.status = status;
            if (email) filter.email = { $regex: email, $options: "i" };

            const sortObj = {};
            sortObj[sortBy] = order === "desc" ? -1 : 1;

            const visas = await Visa.find(filter)
                .sort(sortObj)
                .limit(100);
            
            // 🔹 Log search action
            await logSuccess(req.user._id, "SEARCH_VISA", "Visa", null, req, {
                resultCount: visas.length,
                filters: { status, email }
            });

            return res.json({
                total: visas.length,
                data: visas
            });
        } catch (err) {
            next(err);
        }
    });

    /**
     * GET /visa/:id
     * Get single visa application - ADMIN ONLY OR OWN APPLICATION
     */
    router.get("/:id", async (req, res, next) => {
        try {
            const visa = await Visa.findById(req.params.id);

            if (!visa) {
                if (req.user) {
                    await logError(req.user._id, "SEARCH_VISA", "Visa", req, "Visa not found", {
                        visaId: req.params.id
                    });
                }
                return res.status(404).json({ error: "Visa application not found" });
            }
            
            // 🔹 Log search action
            if (req.user) {
                await logSuccess(req.user._id, "SEARCH_VISA", "Visa", visa._id, req);
            }

            return res.json(visa);
        } catch (err) {
            next(err);
        }
    });

    /**
     * PUT /visa/:id
     * Update visa application - ADMIN ONLY
     */
    router.put("/:id", authMiddleware, authorize("manage_visa"), async (req, res, next) => {
        try {
            const { status, adminNotes } = req.body;

            const visa = await Visa.findByIdAndUpdate(
                req.params.id,
                {
                    status: status || undefined,
                    adminNotes: adminNotes || undefined,
                    reviewedAt: new Date()
                },
                { new: true, runValidators: true }
            );

            if (!visa) {
                await logError(req.user._id, "EDIT_VISA", "Visa", req, "Visa not found", {
                    visaId: req.params.id
                });
                return res.status(404).json({ error: "Visa application not found" });
            }
            
            // 🔹 Log edit action
            await logSuccess(req.user._id, "EDIT_VISA", "Visa", visa._id, req, {
                newStatus: status,
                applicantEmail: visa.email
            });

            return res.json({
                message: "Visa application updated successfully",
                data: visa
            });
        } catch (err) {
            // 🔹 Log error
            await logError(req.user._id, "EDIT_VISA", "Visa", req, err.message, {
                visaId: req.params.id
            });
            next(err);
        }
    });

    /**
     * DELETE /visa/:id
     * Delete visa application - ADMIN ONLY
     */
    router.delete("/:id", authMiddleware, authorize("manage_visa"), async (req, res, next) => {
        try {
            const visa = await Visa.findByIdAndDelete(req.params.id);

            if (!visa) {
                await logError(req.user._id, "DELETE_VISA", "Visa", req, "Visa not found", {
                    visaId: req.params.id
                });
                return res.status(404).json({ error: "Visa application not found" });
            }
            
            // 🔹 Log delete action
            await logSuccess(req.user._id, "DELETE_VISA", "Visa", req.params.id, req, {
                applicantEmail: visa.email
            });

            return res.json({ message: "Visa application deleted successfully" });
        } catch (err) {
            // 🔹 Log error
            await logError(req.user._id, "DELETE_VISA", "Visa", req, err.message, {
                visaId: req.params.id
            });
            next(err);
        }
    });

    /**
     * GET /visa/status/:id
     * Get visa application status - PUBLIC ROUTE
     */
    router.get("/status/:id", async (req, res, next) => {
        try {
            const visa = await Visa.findById(req.params.id);

            if (!visa) {
                return res.status(404).json({ error: "Visa application not found" });
            }
            
            // 🔹 Log status check (public search)
            // Note: No userId since it's public

            return res.json({
                applicationId: visa._id,
                email: visa.email,
                status: visa.status,
                submittedAt: visa.submittedAt,
                updatedAt: visa.updatedAt,
                adminNotes: visa.status === 'needs_info' ? visa.adminNotes : undefined
            });
        } catch (err) {
            next(err);
        }
    });

    module.exports = router;
