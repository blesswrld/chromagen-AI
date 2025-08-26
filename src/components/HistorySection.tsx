"use client";

import { useState } from "react";
import { Text, Button, Spacer, Card, Checkbox, Tooltip } from "@geist-ui/core";
import { Code as CodeIcon } from "lucide-react";
import { handleCopyToClipboard, generateCssExport } from "@/lib/utils";
import { HISTORY_LIMIT, HISTORY_VISIBLE_LIMIT } from "@/lib/constants";

type HistorySectionProps = {
    history: string[][];
    selectedHistoryIndices: number[];
    handleToggleHistorySelection: (index: number) => void;
    handleExportSelected: () => void;
};

export function HistorySection({
    history,
    selectedHistoryIndices,
    handleToggleHistorySelection,
    handleExportSelected,
}: HistorySectionProps) {
    const [showAllHistory, setShowAllHistory] = useState(false);

    if (history.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 w-full max-w-2xl">
            <div className="flex items-center justify-between">
                <Text h3>История</Text>
                {selectedHistoryIndices.length > 0 && (
                    /* @ts-expect-error Geist UI props conflict with React 18 types */
                    <Button
                        auto
                        scale={2 / 3}
                        type="secondary"
                        onClick={handleExportSelected}
                    >
                        Экспорт выбранных ({selectedHistoryIndices.length})
                    </Button>
                )}
            </div>
            <Spacer h={1} />
            <div className="flex flex-col gap-4">
                {history
                    .slice(
                        0,
                        showAllHistory ? HISTORY_LIMIT : HISTORY_VISIBLE_LIMIT
                    )
                    .map((histPalette, index) => {
                        // Проверка на корректность данных
                        if (
                            !Array.isArray(histPalette) ||
                            histPalette.length === 0
                        ) {
                            return null;
                        }
                        const isSelected =
                            selectedHistoryIndices.includes(index);
                        return (
                            <Card
                                key={index}
                                width="100%"
                                className={`transition-all ${
                                    isSelected ? "border-black" : ""
                                }`}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Верхняя строка с чекбоксом */}
                                    <div>
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() =>
                                                handleToggleHistorySelection(
                                                    index
                                                )
                                            }
                                            scale={1.2}
                                        />
                                    </div>
                                    {/* Нижняя строка с цветами */}
                                    <div className="flex w-full items-center gap-2">
                                        {histPalette.map((color, j) => (
                                            <div
                                                key={j}
                                                className="h-10 flex-1 cursor-pointer rounded-md transition-transform hover:scale-105"
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                onClick={() =>
                                                    handleCopyToClipboard(
                                                        color,
                                                        "Цвет скопирован!"
                                                    )
                                                }
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <Card.Footer>
                                    <div className="flex w-full justify-end">
                                        {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                                        <Button
                                            auto
                                            scale={1 / 2}
                                            onClick={() =>
                                                handleCopyToClipboard(
                                                    generateCssExport(
                                                        histPalette
                                                    ),
                                                    "CSS этой палитры скопирован!"
                                                )
                                            }
                                        >
                                            <CodeIcon className="mr-1 h-4 w-4" />
                                            Экспорт CSS
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        );
                    })}
            </div>
            {history.length > HISTORY_VISIBLE_LIMIT && (
                <div className="mt-4 flex justify-center">
                    {/* @ts-expect-error Geist UI props conflict with React 18 types */}
                    <Button
                        auto
                        onClick={() => setShowAllHistory(!showAllHistory)}
                    >
                        {showAllHistory
                            ? "Скрыть"
                            : `Показать еще ${
                                  history.length - HISTORY_VISIBLE_LIMIT
                              }`}
                    </Button>
                </div>
            )}
        </div>
    );
}
