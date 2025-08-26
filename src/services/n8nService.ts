import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import N8nUserResponse, { IN8nUserResponse } from '../models/N8nUserResponse';
import logger from '../config/logger';

class N8nService {
  async sendToWebhook(data: any, filePath: string): Promise<any> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      logger.error('N8N_WEBHOOK_URL is not defined in environment variables.');
      throw new Error('N8N_WEBHOOK_URL is not defined.');
    }

    const form = new FormData();
    form.append('document', fs.createReadStream(filePath));

    // Append other data fields from the request body
    if (data && typeof data === 'object') {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          form.append(key, data[key]);
        }
      }
    }

    try {
      const response = await axios.post(webhookUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      const anyError = error as any;
      if (anyError.isAxiosError) {
        logger.error('Error sending data to n8n webhook', {
          error: anyError.response ? anyError.response.data : anyError.message,
          webhookUrl,
        });
      } else {
        logger.error('An unexpected error occurred', {
          error,
          webhookUrl,
        });
      }
      throw error;
    }
  }

  async getN8nResponsesByUserId(userId: string): Promise<IN8nUserResponse[]> {
    return N8nUserResponse.find({ user: userId }).sort({ createdAt: -1 });
  }
}

export const n8nService = new N8nService();