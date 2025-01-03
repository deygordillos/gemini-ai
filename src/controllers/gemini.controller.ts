import { Request, Response } from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import config from "../config/config";

export const getOCRDataImageByBase64 = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { geminiPromt, base64Image } = req.body
        console.log('getOCRDataImageByBase64 request: ', JSON.stringify(req.body))
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);

        const schema = {
            description: "Listado de dbm",
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    data: {
                        type: SchemaType.STRING,
                        description: "dbm",
                        nullable: false,
                    },
                },
                required: ["data"],
            },
        };

        const model = genAI.getGenerativeModel({
            model: config.geminiModel,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: config.geminiMimeType,
                },
            },
            geminiPromt,
        ]);

        const data = JSON.parse(result.response.text());
        
        if (data.length === 0) return res.status(500).send({ code: 404, message: 'dbm not found' });

        const response = {
            code: 200,
            response: data[0]
        };
        console.log('getOCRDataImageByBase64 response: ', JSON.stringify(response));
        return res.status(200).send(response);
    } catch (e) {
        return res.status(500).send({ code: 500, message: 'error', data: e });
    }
};