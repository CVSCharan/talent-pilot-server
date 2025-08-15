import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// Set your n8n webhook URL here!
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  throw new Error(
    "N8N_WEBHOOK_URL is not defined in the environment variables"
  );
}

export const sendToWebhook = async (
  fields: Record<string, any>,
  filePath: string
): Promise<any> => {
  const form = new FormData();

  // Append fields (stringify objects)
  Object.entries(fields).forEach(([key, value]) => {
    form.append(key, typeof value === "object" ? JSON.stringify(value) : value);
  });

  // Append file under the key 'document' (to match multer)
  form.append("document", fs.createReadStream(filePath), {
    filename: filePath.split("/").pop(),
    contentType: "application/pdf", // adjust if needed
  });

  try {
    const response = await axios.post(WEBHOOK_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      responseType: "text", // n8n might return plain text, so parse manually
    });

    console.log("Response from n8n webhook:", response.data);

    let parsedData: any;
    try {
      parsedData = JSON.parse(response.data as string); // Parse if it's JSON
    } catch {
      parsedData = response.data; // Keep as string if not JSON
    }

    return {
      success: true,
      statusCode: 200,
      message: "Data sent to n8n webhook successfully",
      data: parsedData,
    };
  } catch (error: any) {
    console.error(
      "Error sending to n8n webhook:",
      error.response?.data || error.message
    );

    let parsedError: any;
    try {
      parsedError = JSON.parse(error.response?.data);
    } catch {
      parsedError = error.response?.data || error.message;
    }

    return {
      success: false,
      statusCode: error.response?.status || 500,
      message: "Failed to send data to n8n webhook",
      error: parsedError,
    };
  }
};
