"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/visionary/image-uploader";
import AnalysisResults from "@/components/visionary/analysis-results";
import { analyzeImage, getUseCases } from "@/app/actions";
import { Logo } from "@/components/visionary/icons";

export type UseCaseState = Record<string, { suggestions: string[]; isLoading: boolean }>;

export default function VisionaryApp() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCaseState>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const resetState = () => {
    setAnalysis(null);
    setUseCases({});
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    resetState();

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(imagePreview);
      setAnalysis(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestUseCases = useCallback(async (objectName: string) => {
      if (!objectName.trim()) return;

      setUseCases(prev => ({ ...prev, [objectName]: { suggestions: [], isLoading: true } }));

      try {
        const result = await getUseCases(objectName);
        setUseCases(prev => ({ ...prev, [objectName]: { suggestions: result, isLoading: false } }));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to get suggestions",
          description: "Please try again later.",
        });
        setUseCases(prev => {
          const newCases = { ...prev };
          delete newCases[objectName];
          return newCases;
        });
      }
    }, [toast]);

  const handleDownload = () => {
    const dataToDownload = {
      analysis,
      useCases: Object.fromEntries(
        Object.entries(useCases).map(([key, value]) => [key, value.suggestions])
      ),
    };
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visionary_analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Success", description: "Results downloaded." });
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-8 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Visionary</h1>
        </div>
        {analysis && (
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2" />
            Download Results
          </Button>
        )}
      </header>

      <main className="p-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader onImageSelect={handleImageSelect} />
              {imagePreview && (
                <div className="mt-4 aspect-video relative rounded-lg overflow-hidden border">
                  <Image src={imagePreview} alt="Uploaded preview" layout="fill" objectFit="contain" />
                </div>
              )}
              <Button onClick={handleAnalyze} disabled={!imagePreview || isAnalyzing} className="w-full mt-4 bg-primary hover:bg-primary/90">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </CardContent>
          </Card>

          <AnalysisResults
            analysis={analysis}
            useCases={useCases}
            isAnalyzing={isAnalyzing}
            onSuggestUseCases={handleSuggestUseCases}
          />
        </div>
      </main>
    </div>
  );
}