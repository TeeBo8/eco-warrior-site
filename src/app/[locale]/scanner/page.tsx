import { VisualScanner } from "@/components/visual-scanner";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'ScannerPage' });
    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ScannerPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ScannerPage' });


    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                    {t('title')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {t('badge')}
                </div>
            </div>

            <VisualScanner locale={locale} />
        </div>
    );
}
