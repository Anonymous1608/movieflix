import express from "express";
import { Review } from "../models/Review.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { validateReview, validateRequest } from "../middleware/validator.js";
import { AppError } from "../middleware/errorHandler.js";
import { Response, NextFunction } from "express";
const router = express.Router();

// Create or update review
router.post(
  "/:movieId",
  authenticate,
  validateReview,
  validateRequest,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      const { rating, comment } = req.body;

      const review = await Review.findOneAndUpdate(
        { userId: req.user!.id, movieId },
        { rating, comment },
        { new: true, upsert: true }
      );

      res.json({ message: "Review saved", review });
    } catch (error) {
      next(error);
    }
  }
);

// Get reviews for a movie
router.get("/:movieId", async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);
    if (isNaN(movieId)) {
      throw new AppError("Invalid movie ID", 400);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ movieId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ movieId });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating: averageRating.toFixed(1),
    });
  } catch (error) {
    next(error);
  }
});

// Delete review
router.delete(
  "/:movieId",
  authenticate,
  async (req: AuthRequest, res, next) => {
    try {
      const movieId = parseInt(req.params.movieId);
      if (isNaN(movieId)) {
        throw new AppError("Invalid movie ID", 400);
      }

      await Review.findOneAndDelete({ userId: req.user!.id, movieId });

      res.json({ message: "Review deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
