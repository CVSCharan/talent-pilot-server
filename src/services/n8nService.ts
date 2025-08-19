import N8nUserResponse from '../models/N8nUserResponse';

export const saveN8nResponse = async (response: any) => {
  try {
    const n8nUserResponse = new N8nUserResponse(response);
    await n8nUserResponse.save();
    return n8nUserResponse;
  } catch (error) {
    throw new Error('Error saving n8n response');
  }
};

export const getN8nResponsesByUserId = async (userId: string) => {
  try {
    const responses = await N8nUserResponse.find({ user: userId });
    return responses;
  } catch (error) {
    throw new Error('Error retrieving n8n responses');
  }
};

export const sendToWebhook = async (data: any, filePath: string): Promise<any> => {
  // In a real application, you would send the data and file to the n8n webhook URL.
  // For this example, we'll just return a mock response.
  return Promise.resolve({ success: true });
};
