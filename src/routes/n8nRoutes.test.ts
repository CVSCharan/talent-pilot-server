import request from 'supertest';
import express from 'express';
import n8nRoutes from './n8nRoutes';
import * as n8nService from '../services/n8nService';
import N8nUserResponse from '../models/N8nUserResponse';
import logger from '../config/logger';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Mock the dependencies
jest.mock('../services/n8nService');
jest.mock('../config/logger');
jest.mock('../models/N8nUserResponse', () => ({
  __esModule: true,
  default: {
    countDocuments: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());

// Minimal passport setup for testing
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'test-secret',
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  done(null, { _id: jwt_payload.sub });
}));

app.use(passport.initialize());
app.use('/api/n8n', n8nRoutes);

// Add a generic error handler to the test app to prevent crashing on multer errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    res.status(500).send(err.message);
  } else {
    next();
  }
});

describe('N8N Routes', () => {
  let token: string;
  const userId = new mongoose.Types.ObjectId().toString();

  beforeAll(() => {
    token = jwt.sign({ sub: userId }, 'test-secret');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 on successful webhook call', async () => {
    (N8nUserResponse.countDocuments as jest.Mock).mockResolvedValue(0);
    (n8nService.sendToWebhook as jest.Mock).mockResolvedValue({ success: true });
    (N8nUserResponse.prototype.save as jest.Mock).mockResolvedValue({});

    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), {
        filename: 'test.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(N8nUserResponse.prototype.save).toHaveBeenCalledTimes(1);
  });

  it('should return 429 if user has reached the request limit', async () => {
    (N8nUserResponse.countDocuments as jest.Mock).mockResolvedValue(2);

    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), 'test.txt');

    expect(res.status).toBe(429);
    expect(res.text).toBe('You have reached the maximum number of requests.');
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.text).toBe('No file uploaded.');
  });

  it('should return 500 for invalid file type', async () => {
    const res = await request(app)
      .post('/api/n8n')
      .set('Authorization', `Bearer ${token}`)
      .attach('document', Buffer.from('test file content'), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      });

    expect(res.status).toBe(500);
    expect(res.text).toContain('Invalid file type');
  });
});
