import { Request, Response } from "express";
import { n8nService } from "../services/n8nService";
import fs from "fs";
import N8nUserResponse from "../models/N8nUserResponse";
import { IUser } from "../models/User";
import logger from "../config/logger";

const MAX_REQUESTS = process.env.N8N_MAX_REQUESTS
  ? parseInt(process.env.N8N_MAX_REQUESTS, 10)
  : 2;

export const handleWebhook = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const user = req.user as IUser;
  const userId = user._id;
  const filePath = req.file.path; // defined early

  try {
    const requestCount = await N8nUserResponse.countDocuments({ user: userId });

    if (requestCount >= MAX_REQUESTS) {
      logger.warn(
        `User ${userId} exceeded max requests limit of ${MAX_REQUESTS}.`
      );
      return res
        .status(429)
        .send("You have reached the maximum number of requests.");
    }

    const result = await n8nService.sendToWebhook(req.body, filePath);

    const newResponse = new N8nUserResponse({
      user: userId,
      ...result,
    });
    await newResponse.save();
    res.json(result);
  } catch (error) {
    logger.error("Error processing webhook", {
      error,
      userId,
      file: req.file.originalname,
    });
    res.status(500).send("Error processing webhook");
  } finally {
    // This finally block will be executed even if there is a return inside the try block
    // or if an exception is thrown.
    fs.unlink(filePath, (err) => {
      if (err) {
        logger.error("Failed to delete uploaded file", {
          error: err,
          filePath,
        });
      }
    });
  }
};

export const getN8nResponses = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const userId = user._id as string;

  try {
    const responses = await n8nService.getN8nResponsesByUserId(userId);
    res.json(responses);
  } catch (error) {
    logger.error("Error retrieving n8n responses", { error, userId });
    res.status(500).send("Error retrieving n8n responses");
  }
};
