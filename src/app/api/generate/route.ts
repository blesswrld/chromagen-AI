import { NextResponse } from "next/server";
import Groq from "groq-sdk";
// Импортируем новый класс InferenceClient
import { InferenceClient } from "@huggingface/inference";

// Клиент для Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Клиент для Hugging Face
const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
    try {
        const { prompt, model, colorCount, style, frozenColors } =
            await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Промпт не предоставлен" },
                { status: 400 }
            );
        }

        // Динамически строим системный промпт
        let systemPrompt = `You are an expert color palette designer.`;

        // Добавляем логику для "замороженных" цветов
        if (frozenColors && frozenColors.length > 0) {
            systemPrompt += ` Generate a palette that harmonizes with these existing colors: ${frozenColors.join(
                ", "
            )}. Include these exact colors in the final output. The total number of colors should be ${
                colorCount || 5
            }.`;
        } else {
            // Стандартная логика, если нет "замороженных" цветов
            systemPrompt += ` Your task is to generate a color palette of ${
                colorCount || 5
            } harmonious colors based on the user's text description.`;
        }

        // Добавляем уточнение по стилю, если он выбран
        if (style && style !== "default") {
            systemPrompt += ` The palette should be in a ${style} style.`;
        }

        // Заключительная, самая важная часть промпта
        systemPrompt += ` Respond ONLY in a valid JSON array of strings, where each string is a HEX color code. Do not add any explanations, comments, or markdown formatting (no \`\`\`json). Example response: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#0000FF"]`;

        // Разрешаем переменной принимать 'undefined'
        let content: string | null | undefined = null;

        if (model === "groq") {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                model: "llama3-8b-8192",
                temperature: 0.7,
            });
            content = chatCompletion.choices[0]?.message?.content;
        } else if (model === "huggingface") {
            const chatCompletion = await hf.chatCompletion({
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                max_tokens: 200,
            });

            // Новый класс возвращает content как string, а не object
            // Поэтому, если content есть, он уже строка. Если нет, он null.
            if (chatCompletion.choices[0].message) {
                content = chatCompletion.choices[0].message.content;
            }
        } else {
            return NextResponse.json(
                { error: "Неизвестная модель AI" },
                { status: 400 }
            );
        }

        if (!content) {
            throw new Error("AI не вернул результат");
        }

        // Эта логика будет одинаково хорошо работать для обеих моделей
        const jsonMatch = content.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : content.trim();
        const parsedContent = JSON.parse(jsonString);
        const colors = Array.isArray(parsedContent)
            ? parsedContent
            : parsedContent.colors || [];

        return NextResponse.json({ palette: colors });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Ошибка при генерации палитры" },
            { status: 500 }
        );
    }
}
