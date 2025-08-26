"use client";

import { motion } from "framer-motion";
import { Text, Card, Button } from "@geist-ui/core";
import { Clipboard, Code as CodeIcon, Lock, Unlock } from "lucide-react";
import { handleCopyToClipboard, generateCssExport } from "@/lib/utils";

type PaletteDisplayProps = {
    palette: string[];
    frozenColors: string[];
    onToggleFreeze: (color: string) => void;
};

export function PaletteDisplay({
    palette,
    frozenColors,
    onToggleFreeze,
}: PaletteDisplayProps) {
    if (palette.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Card width="100%">
                <Text h4 className="text-center">
                    Ваша палитра:
                </Text>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                    {palette.map((color, index) => {
                        const isFrozen = frozenColors.includes(color);
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="relative h-24 w-full">
                                    <div
                                        className="h-full w-full rounded-md shadow-md"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                                    <Button
                                        auto
                                        icon={isFrozen ? <Lock /> : <Unlock />}
                                        onClick={() => onToggleFreeze(color)}
                                        className="!absolute top-1 right-1 !bg-white/50 !p-1 backdrop-blur-sm"
                                        scale={1 / 2}
                                    />
                                </div>
                                <div
                                    className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200"
                                    onClick={() =>
                                        handleCopyToClipboard(
                                            color,
                                            "Цвет скопирован!"
                                        )
                                    }
                                >
                                    <Clipboard
                                        size={16}
                                        className="text-gray-500"
                                    />
                                </div>
                            </div>
                        );
                    })}
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
                            <CodeIcon className="mr-1 h-4 w-4" />
                            Экспорт CSS
                        </Button>
                    </div>
                </Card.Footer>
            </Card>
        </motion.div>
    );
}
