"use client";

import { GeistProvider, CssBaseline } from "@geist-ui/core";
import React from "react";
import { Toaster } from "react-hot-toast"; // <-- 1. Импортируем Toaster

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GeistProvider>
            <CssBaseline />
            <Toaster position="bottom-center" />
            {/* <-- 2. Добавляем компонент */}
            {children}
        </GeistProvider>
    );
}
