"use client";

import React from "react";
import { Toaster } from "react-hot-toast"; // <-- 1. Импортируем Toaster
import { GeistProvider } from "@geist-ui/core";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GeistProvider>
            <Toaster position="bottom-center" />
            {/* <-- 2. Добавляем компонент */}
            {children}
        </GeistProvider>
    );
}
