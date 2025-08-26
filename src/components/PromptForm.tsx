"use client";

import { Input, Button, Tooltip, Select, Spinner } from "@geist-ui/core";
import { Dices } from "lucide-react";

type PromptFormProps = {
    prompt: string;
    setPrompt: (value: string) => void;
    selectedModel: string;
    setSelectedModel: (value: string) => void;
    loading: boolean;
    handleGenerate: () => void;
    handleLuckyClick: () => void;
    colorCount: number;
    setColorCount: (count: number) => void;
    style: string;
    setStyle: (style: string) => void;
};

export function PromptForm({
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    loading,
    handleGenerate,
    handleLuckyClick,
    colorCount,
    setColorCount,
    style,
    setStyle,
}: PromptFormProps) {
    return (
        <div className="flex w-full flex-col gap-3">
            {/* @ts-expect-error Geist UI props conflict with React 18 types */}
            <Select
                placeholder="Выберите модель"
                value={selectedModel}
                onChange={(val) => setSelectedModel(val as string)}
                width="100%"
            >
                <Select.Option value="groq">
                    Groq (Сверхбыстрая бесплатная)
                </Select.Option>
                <Select.Option value="huggingface">
                    Hugging Face (Более медленная бесплатная)
                </Select.Option>
            </Select>

            {/* Адаптивный блок для селектов */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                <Select
                    placeholder="Количество цветов"
                    value={String(colorCount)}
                    onChange={(v) => setColorCount(Number(v))}
                >
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                    <Select.Option value="10">10</Select.Option>
                </Select>
                {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                <Select
                    placeholder="Стиль"
                    value={style}
                    onChange={(v) => setStyle(v as string)}
                >
                    <Select.Option value="default">По умолчанию</Select.Option>
                    <Select.Option value="pastel">Пастельный</Select.Option>
                    <Select.Option value="vibrant">Яркий</Select.Option>
                    <Select.Option value="dark">Темный</Select.Option>
                </Select>
            </div>

            <div className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-2">
                {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Например, неоновый Токио ночью"
                    width="100%"
                    disabled={loading}
                />
                <Tooltip text="Мне повезет!">
                    {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                    <Button icon={<Dices />} onClick={handleLuckyClick} auto />
                </Tooltip>
                {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    auto
                    type="secondary-light"
                    className="!flex !items-center !justify-center"
                >
                    {loading ? <Spinner /> : "Сгенерировать"}
                </Button>
            </div>
        </div>
    );
}
