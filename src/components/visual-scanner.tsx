'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Loader2, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeCarbonFootprint } from '@/server/actions/scan-image';

export function VisualScanner() {
    const locale = 'fr';
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<{
        title: string;
        estimate: string;
        explanation: string;
        verdict: string;
        alternative?: string;
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner un fichier image');
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('L\'image est trop grande. Maximum 10MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null); // Reset previous result
            };
            reader.onerror = () => {
                alert('Erreur lors de la lecture du fichier');
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        // Check if environment supports mediaDevices (requires HTTPS or localhost)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("La caméra nécéssite une connexion sécurisée (HTTPS). Ouverture de la galerie/caméra native à la place.");
            fileInputRef.current?.click();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOpen(true);
            }
        } catch (error) {
            console.error('Erreur accès caméra:', error);
            // Fallback to file input if permission denied or other error
            alert('Impossible d\'accéder à la caméra direct. Ouverture de l\'import...');
            fileInputRef.current?.click();
        }
    };

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImage(dataUrl);
            setResult(null);
            stopCamera();
        }
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    const handleAnalyze = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        setResult(null);

        try {
            // Extract base64 (remove 'data:image/jpeg;base64,' prefix)
            const base64Data = image.split(',')[1];
            if (!base64Data) {
                throw new Error('Impossible d\'extraire les données de l\'image');
            }

            const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';

            if (!mimeType.startsWith('image/')) {
                throw new Error('Le fichier doit être une image');
            }

            const analysis = await analyzeCarbonFootprint(base64Data, mimeType, locale);
            setResult(analysis);
        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : "Erreur lors de l'analyse Gemini. Veuillez vérifier votre clé API et réessayer.";
            alert(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="relative aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors">
                {isCameraOpen ? (
                    <div className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center">
                            <Button onClick={capturePhoto} size="lg" className="rounded-full">
                                <Camera className="w-5 h-5 mr-2" />
                                Capturer
                            </Button>
                            <Button onClick={stopCamera} variant="destructive" size="lg" className="rounded-full">
                                Annuler
                            </Button>
                        </div>
                    </div>
                ) : image ? (
                    <div className="relative w-full h-full">
                        <Image src={image} alt="Preview" fill className="object-cover" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                            onClick={() => {
                                setImage(null);
                                setResult(null);
                            }}
                        >
                            ×
                        </Button>
                    </div>
                ) : (
                    <div className="text-center space-y-4 p-6">
                        <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">Prenez une photo ou importez une image</p>
                        <div className="flex gap-2 justify-center">
                            <Button variant="outline" onClick={startCamera}>
                                <Camera className="w-4 h-4 mr-2" />
                                Caméra
                            </Button>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Importer
                            </Button>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
            </div>

            {image && !result && (
                <Button
                    className="w-full text-lg h-12"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyse Gemini en cours...
                        </>
                    ) : (
                        <>
                            <Leaf className="w-5 h-5 mr-2" />
                            Scanner l&apos;empreinte carbone
                        </>
                    )}
                </Button>
            )}

            {result && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 bg-card border-primary/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{result.title}</h3>
                            <VerdictBadge verdict={result.verdict} />
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-3xl font-extrabold text-primary">{result.estimate}</p>
                            <p className="text-sm text-muted-foreground">Estimation CO₂e</p>
                        </div>

                        <p className="text-muted-foreground">{result.explanation}</p>

                        {result.alternative && (
                            <div className="pt-2 border-t mt-4">
                                <p className="text-sm font-semibold text-green-600 mb-1">Alternative suggérée :</p>
                                <p className="text-sm">{result.alternative}</p>
                            </div>
                        )}

                        <Button variant="outline" className="w-full mt-4" onClick={() => { setImage(null); setResult(null); }}>
                            Scanner un autre objet
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function VerdictBadge({ verdict }: { verdict: string }) {
    const styles = {
        Good: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        Neutral: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };

    const icons = {
        Good: CheckCircle,
        Neutral: AlertTriangle,
        High: AlertTriangle
    };

    const Icon = icons[verdict as keyof typeof icons] || AlertTriangle;
    const style = styles[verdict as keyof typeof styles] || styles.Neutral;

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${style}`}>
            <Icon className="w-4 h-4" />
            {verdict === 'Good' ? 'Bon' : verdict === 'High' ? 'Élevé' : 'Neutre'}
        </span>
    );
}
