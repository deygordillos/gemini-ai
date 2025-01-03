export default {
    port: process.env.PORT || 4100,
    host: process.env.HOST || 'http://localhost:4100/v1',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: 'models/gemini-1.5-pro'
}