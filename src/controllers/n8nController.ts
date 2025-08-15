import { Request, Response } from 'express';
import * as n8nService from '../services/n8nService';
import fs from 'fs';

export const handleWebhook = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  try {
    const result = await n8nService.sendToWebhook(req.body, filePath);
    res.json(result);
  } catch (error) {
    res.status(500).send('Error processing webhook');
  } finally {
    // Clean up the uploaded file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    });
  }
};