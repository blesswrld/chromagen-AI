import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
    title: "ChromaGen, AI-powered color palette generator",
    // description: "AI-powered color palette generator",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body>
                <Providers>
                    {/* <--- Используем обертку */}
                    {children}
                </Providers>
            </body>
        </html>
    );
}
