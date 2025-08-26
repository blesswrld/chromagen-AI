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
};

export function PromptForm({
    prompt,
    setPrompt,
    selectedModel,
    setSelectedModel,
    loading,
    handleGenerate,
    handleLuckyClick,
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

            {/* Используем Grid для Input и Button */}
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
