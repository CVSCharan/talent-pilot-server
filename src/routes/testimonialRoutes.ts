
import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController';
import { validateTestimonial } from '../middlewares/validation';
import passport from 'passport';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Testimonial management
 */

// Public routes
/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: A list of testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 */
router.get('/', testimonialController.getAllTestimonials);

/**
 * @swagger
 * /api/testimonials/approved:
 *   get:
 *     summary: Get all approved testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: A list of approved testimonials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Testimonial'
 */
router.get('/approved', testimonialController.getApprovedTestimonials);

/**
 * @swagger
 * /api/testimonials:
 *   post:
 *     summary: Create a new testimonial
 *     tags: [Testimonials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Testimonial'
 *     responses:
 *       201:
 *         description: The testimonial was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Testimonial'
 *       400:
 *         description: Bad request
 */
router.post('/', validateTestimonial, testimonialController.createTestimonial);

router.get('/:id([0-9a-fA-F]{24})', testimonialController.getTestimonialById);

// Protected routes (admin only, for example)
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @swagger
 * /api/testimonials/has-testimonial:
 *   get:
 *     summary: Check if user has an approved testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns true if user has an approved testimonial, false otherwise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasTestimonial:
 *                   type: boolean
 */
router.get('/has-testimonial', testimonialController.hasTestimonial);


/**
 * @swagger
 * /api/testimonials/{id}:
 *   put:
 *     summary: Update a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The testimonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Testimonial'
 *     responses:
 *       200:
 *         description: The testimonial was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Testimonial'
 *       404:
 *         description: The testimonial was not found
 */
router.put('/:id', validateTestimonial, testimonialController.updateTestimonial);

/**
 * @swagger
 * /api/testimonials/{id}:
 *   delete:
 *     summary: Delete a testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The testimonial ID
 *     responses:
 *       200:
 *         description: The testimonial was deleted
 *       404:
 *         description: The testimonial was not found
 */
router.delete('/:id', testimonialController.deleteTestimonial);

export default router;
