import { Request, Response } from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import config from "../config/config";

export const getOCRDataImageByBase64 = async (req: Request, res: Response): Promise<Response> => {
    try {
        let { geminiPrompt, base64Image, keys } = req.body

        if (!geminiPrompt || !base64Image) {
            console.error("No se envió geminiPrompt o la imagen");
            return res.status(400).send({ code: 400, message: "Debe enviar el prompt y la imagen en base64" });
        }

        if (!Array.isArray(keys) || keys.length === 0) {
            keys = ["data"];
        }
        console.log('getOCRDataImageByBase64 geminiPrompt: ', geminiPrompt)
        const genAI = new GoogleGenerativeAI(config.geminiApiKey);

        // Construir el schema dinámicamente según las keys
        const properties: Record<string, any> = {};
        keys.forEach(key => {
            properties[key] = {
                type: SchemaType.STRING,
                description: key,
                nullable: false,
            };
        });

        const schema = {
            description: "Respuesta con las claves solicitadas",
            type: SchemaType.OBJECT,
            properties,
            required: keys,
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
            geminiPrompt,
        ]);
        
        if (!result || !result.response || typeof result.response.text !== "function") {
            console.error("La respuesta del modelo es inválida:", result);
            return res.status(500).send({ code: 500, message: "Respuesta inválida del modelo", response: result });
        }

        const data = JSON.parse(result.response.text());
        console.log({data})
        if (data.length === 0) return res.status(500).send({ code: 404, message: 'dbm not found' });

        const response = {
            code: 200,
            message: 'OK',
            response: data
        };
        console.log('getOCRDataImageByBase64 response: ', JSON.stringify(response));
        return res.status(200).send(response);
    } catch (e) {
        return res.status(500).send({ code: 500, message: 'error', data: e });
    }
};