"use client";

import { Text, Card, Button } from "@geist-ui/core";
import { Clipboard, Code as CodeIcon } from "lucide-react";
import { handleCopyToClipboard, generateCssExport } from "@/lib/utils";

type PaletteDisplayProps = {
    palette: string[];
};

export function PaletteDisplay({ palette }: PaletteDisplayProps) {
    if (palette.length === 0) {
        return null;
    }

    return (
        <Card width="100%">
            <Text h4 className="text-center">
                Ваша палитра:
            </Text>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                {palette.map((color, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                    >
                        <div
                            className="h-24 w-full rounded-md shadow-md"
                            style={{ backgroundColor: color }}
                        ></div>
                        <div
                            className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200"
                            onClick={() =>
                                handleCopyToClipboard(color, "Цвет скопирован!")
                            }
                        >
                            <Clipboard size={16} className="text-gray-500" />
                        </div>
                    </div>
                ))}
            </div>
            <Card.Footer>
                <div className="flex w-full justify-end gap-2">
                    {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                    <Button
                        auto
                        scale={2 / 3}
                        onClick={() =>
                            handleCopyToClipboard(
                                generateCssExport(palette),
                                "CSS скопирован!"
                            )
                        }
                    >
                        <CodeIcon className="w-8 h-4" />
                        Экспорт CSS
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    );
}
