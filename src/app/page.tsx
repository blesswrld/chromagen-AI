"use client";

import { useState } from "react";
import {
    Text,
    Input,
    Button,
    Spacer,
    Card,
    Spinner,
    Snippet,
    Tooltip,
    Select, // <-- Импортируем Select
} from "@geist-ui/core";

export default function HomePage() {
    const [prompt, setPrompt] = useState("");
    const [palette, setPalette] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState("groq");

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Пожалуйста, введите описание.");
            return;
        }

        setLoading(true);
        setError(null);
        setPalette([]);

        try {
            // Передаем выбранную модель в теле запроса
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, model: selectedModel }), // <-- Отправляем модель
            });

            if (!response.ok) throw new Error("Ошибка сети или сервера");

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setPalette(data.palette);
        } catch (err: any) {
            setError(err.message || "Произошла неизвестная ошибка.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-white p-4">
            <div className="w-full max-w-2xl text-center">
                <Text h1 className="font-bold">
                    ChromaGen
                </Text>
                <Text p className="text-gray-500">
                    Опишите идею, и AI создаст для вас цветовую палитру.
                </Text>
                <Spacer h={2} />

                {/* Блок с формой и переключателем */}
                <div className="flex flex-col gap-3">
                    <Select
                        placeholder="Выберите модель"
                        value={selectedModel}
                        onChange={(val) => setSelectedModel(val as string)}
                        width="100%"
                    >
                        <Select.Option value="groq">
                            Groq (Сверхбыстрая)
                        </Select.Option>
                        <Select.Option value="huggingface">
                            Hugging Face (Бесплатная)
                        </Select.Option>
                    </Select>

                    <div className="flex w-full items-center gap-2">
                        <Input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Например, неоновый Токио ночью"
                            width="100%"
                            disabled={loading}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={loading}
                            auto
                            type="secondary-light"
                            // Добавляем классы для идеального центрирования содержимого
                            className="!flex !items-center !justify-center"
                        >
                            {loading ? <Spinner /> : "Сгенерировать"}
                        </Button>
                    </div>
                </div>
            </div>

            <Spacer h={3} />

            {/* Блок с результатом */}
            <div className="w-full max-w-2xl">
                {error && (
                    <Text p type="error">
                        {error}
                    </Text>
                )}
                {palette.length > 0 && (
                    <Card width="100%">
                        <Text h4 className="text-center">
                            Ваша палитра:
                        </Text>
                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                            {palette.map((color, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className="mb-2 h-24 w-full rounded-md shadow-md"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <Tooltip text="Нажмите, чтобы скопировать">
                                        <Snippet text={color} width="100%" />
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </main>
    );
}
