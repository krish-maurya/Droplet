import { th } from "zod/v4/locales";
import { ImageKitProvider } from "@imagekit/next"

export interface ProvidersProps {
    children: React.ReactNode,
}

export function Providers({ children }: ProvidersProps) {
    return (
        <h1>
            <ImageKitProvider urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT!}>
                {children}
            </ImageKitProvider>
        </h1>
    )
}