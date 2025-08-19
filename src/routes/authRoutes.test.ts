import request from 'supertest';
import express from 'express';
import authRoutes from './authRoutes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
    it('should return 400 on signup with invalid data', async () => {
        const res = await request(app).post('/api/auth/signup').send({
            displayName: 'test',
            email: 'test',
            password: '123',
        });
        expect(res.status).toBe(400);
    });
});