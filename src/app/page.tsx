"use client";

import { useEffect, useState } from "react";
import { Text, Spacer } from "@geist-ui/core";

// Импортируем наши новые компоненты
import { PromptForm } from "@/components/PromptForm";
import { PaletteDisplay } from "@/components/PaletteDisplay";
import { HistorySection } from "@/components/HistorySection";
import { ImageUploader } from "@/components/ImageUploader"; // <-- ИМПОРТ

// Импортируем константы и утилиты
import { examplePrompts, HISTORY_LIMIT } from "@/lib/constants";
import { generateCssExport, handleCopyToClipboard } from "@/lib/utils";
import { HistoryItem } from "@/types";
import toast from "react-hot-toast";

export default function HomePage() {
    // --- УПРАВЛЕНИЕ СОСТОЯНИЕМ ---
    const [prompt, setPrompt] = useState("");
    const [palette, setPalette] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState("groq");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [selectedHistoryIndices, setSelectedHistoryIndices] = useState<
        number[]
    >([]);
    const [colorCount, setColorCount] = useState<number>(5);
    const [style, setStyle] = useState<string>("default");
    const [frozenColors, setFrozenColors] = useState<string[]>([]);

    // Загрузка истории из localStorage при первом рендере
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem("chromagen-history");
            if (storedHistory) setHistory(JSON.parse(storedHistory));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Пожалуйста, введите описание.");
            return;
        }

        setLoading(true);
        setError(null);
        setPalette([]); // Очищаем текущую палитру перед новым запросом

        try {
            // Отправляем ВСЕ параметры на бэкенд
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    model: selectedModel,
                    colorCount,
                    style,
                    frozenColors,
                }),
            });

            if (!response.ok) throw new Error("Ошибка сети или сервера");

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            if (data.palette && data.palette.length > 0) {
                setPalette(data.palette);
                const newHistoryItem: HistoryItem = {
                    prompt,
                    palette: data.palette,
                };
                const newHistory = [newHistoryItem, ...history].slice(
                    0,
                    HISTORY_LIMIT
                );
                setHistory(newHistory);
                localStorage.setItem(
                    "chromagen-history",
                    JSON.stringify(newHistory)
                );
            } else {
                setError("AI вернул пустую палитру. Попробуйте другой запрос.");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Произошла неизвестная ошибка.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Переключает выбор палитры в истории
    const handleToggleHistorySelection = (index: number) => {
        setSelectedHistoryIndices((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const handlePromptClick = (p: string) => {
        setPrompt(p);
        toast("Промпт скопирован в поле ввода!");
    };

    const handleExportSelected = () => {
        const selectedItems = history.filter((_, index) =>
            selectedHistoryIndices.includes(index)
        );
        const selectedPalettes = selectedItems.map((item) => item.palette);
        const allColors = selectedPalettes.flat();
        handleCopyToClipboard(
            generateCssExport(allColors),
            `CSS для ${allColors.length} цветов скопирован!`
        );
    };

    // Обработчик для кнопки "Мне повезет!"
    const handleLuckyClick = () => {
        const randomPrompt =
            examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
        setPrompt(randomPrompt);
    };

    const handleToggleFreeze = (color: string) => {
        setFrozenColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color]
        );
    };

    // Принимает палитру из ImageUploader
    const handlePaletteFromImage = (extractedPalette: string[]) => {
        setPalette(extractedPalette);
        setPrompt("Из изображения");
        setError(null);
        setFrozenColors([]);
        toast.success("Палитра из изображения успешно извлечена!");

        const newHistoryItem: HistoryItem = {
            prompt: "Из изображения",
            palette: extractedPalette,
        };
        const newHistory = [newHistoryItem, ...history].slice(0, HISTORY_LIMIT);
        setHistory(newHistory);
        localStorage.setItem("chromagen-history", JSON.stringify(newHistory));
    };

    // --- ОТРИСОВКА ---
    return (
        <main className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-white p-4 pb-24">
            <div className="w-full max-w-2xl text-center">
                <Text h1 className="font-bold text-2xl">
                    ChromaGen
                </Text>
                <Text p className="text-gray-500">
                    Опишите идею, и AI создаст для вас цветовую палитру, или
                    загрузите изображение.
                </Text>
                <Spacer h={2} />

                <PromptForm
                    prompt={prompt}
                    setPrompt={setPrompt}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    loading={loading}
                    handleGenerate={handleGenerate}
                    handleLuckyClick={handleLuckyClick}
                    // Передаем пропсы
                    colorCount={colorCount}
                    setColorCount={setColorCount}
                    style={style}
                    setStyle={setStyle}
                />

                <ImageUploader onPaletteExtracted={handlePaletteFromImage} />
            </div>

            <Spacer h={3} />

            <div className="mt-8 w-full max-w-2xl">
                {error && (
                    <Text p type="error">
                        {error}
                    </Text>
                )}
                <PaletteDisplay
                    palette={palette}
                    // Передаем пропсы
                    frozenColors={frozenColors}
                    onToggleFreeze={handleToggleFreeze}
                />
            </div>

            <HistorySection
                history={history}
                selectedHistoryIndices={selectedHistoryIndices}
                handleToggleHistorySelection={handleToggleHistorySelection}
                handleExportSelected={handleExportSelected}
                // Передаем пропс
                onPromptClick={handlePromptClick}
            />
        </main>
    );
}
