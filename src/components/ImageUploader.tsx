"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button, Loading } from "@geist-ui/core";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import ColorThief from "colorthief"; //  Импортируем напрямую

type ImageUploaderProps = {
    onPaletteExtracted: (palette: string[]) => void;
};

// Хелпер остается тем же
const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

export function ImageUploader({ onPaletteExtracted }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;

            // Создаем Image объект в памяти
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = () => {
                try {
                    const colorThief = new ColorThief();
                    // Получаем палитру из загруженного изображения
                    const paletteRgb = colorThief.getPalette(image, 5);

                    if (paletteRgb && paletteRgb.length > 0) {
                        const paletteHex = paletteRgb.map((rgb) =>
                            rgbToHex(rgb[0], rgb[1], rgb[2])
                        );
                        onPaletteExtracted(paletteHex);
                    } else {
                        throw new Error("Не удалось извлечь палитру.");
                    }
                } catch (err) {
                    console.error("ColorThief error:", err);
                    toast.error("Не удалось проанализировать изображение.");
                } finally {
                    setLoading(false);
                }
            };
            image.onerror = () => {
                toast.error("Не удалось загрузить изображение.");
                setLoading(false);
            };

            image.src = imgSrc;
        };

        reader.onerror = () => {
            toast.error("Не удалось прочитать файл.");
            setLoading(false);
        };

        reader.readAsDataURL(file);
    };

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="mt-4 w-full">
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {/* @ts-expect-error Geist UI props conflict with React 18 types */}
            <Button
                icon={<UploadCloud />}
                onClick={handleButtonClick}
                disabled={loading}
                width="100%"
            >
                {loading ? (
                    <Loading>Анализ...</Loading>
                ) : (
                    "Загрузить изображение для палитры"
                )}
            </Button>
        </div>
    );
}
