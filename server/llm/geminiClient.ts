import axios from 'axios';

const GEMINI_API_URL = 'https://api.gemini.com/v1/'; // Replace with the actual Gemini API URL

export class GeminiClient {
    private apiKey: string;
    private apiSecret: string;

    constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public async query(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${GEMINI_API_URL}query`, {
                prompt: prompt,
                apiKey: this.apiKey,
                apiSecret: this.apiSecret,
            });

            return response.data.response; // Adjust based on the actual response structure
        } catch (error) {
            console.error('Error querying Gemini API:', error);
            throw new Error('Failed to fetch response from Gemini API');
        }
    }
}