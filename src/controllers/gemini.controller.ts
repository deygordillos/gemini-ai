import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config";

export const getOCRDataImageByBase64 = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { geminiPromt, base64Image } = req.body

        const genAI = new GoogleGenerativeAI(config.geminiApiKey);

        const model = genAI.getGenerativeModel({ model: config.geminiModel });

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
            geminiPromt,
        ]);
        return res.status(200).send({ message: result.response.text() });
    } catch (e) {
        return res.status(500).send({ message: 'error', data: e });
    }
};