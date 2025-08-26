import toast from "react-hot-toast";

// Функция для копирования текста с уведомлением
export const handleCopyToClipboard = async (text: string, message: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(message);
    } catch (err) {
        toast.error("Не удалось скопировать!");
    }
};

// Функции для экспорта палитры
export const generateCssExport = (p: string[]) => `
    :root {
    ${p.map((color, i) => `  --color-${i + 1}: ${color};`).join("\n")}
    }`;
