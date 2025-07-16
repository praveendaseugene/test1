"use client";

import React, { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { UseCaseState } from './visionary-app';

interface AnalysisResultsProps {
  analysis: string | null;
  useCases: UseCaseState;
  isAnalyzing: boolean;
  onSuggestUseCases: (objectName: string) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysis,
  useCases,
  isAnalyzing,
  onSuggestUseCases,
}) => {
  const [objectName, setObjectName] = useState('');

  const handleSuggestionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSuggestUseCases(objectName);
    setObjectName('');
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="text-center py-16">
          <Wand2 className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Upload an image and click "Analyze Image" to see the magic happen.</p>
        </div>
      );
    }

    return (
      <>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>{analysis}</p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="text-accent" />
            Explore Use Cases
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Enter an object from the analysis to get AI-powered suggestions.
          </p>

          <form onSubmit={handleSuggestionSubmit} className="flex gap-2 mt-4">
            <Input
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              placeholder="e.g., car, tree, house"
              className="flex-grow"
            />
            <Button type="submit" variant="secondary" disabled={!objectName.trim()}>
              Suggest
            </Button>
          </form>

          {Object.keys(useCases).length > 0 && (
            <div className="mt-6 space-y-4">
              {Object.entries(useCases).map(([obj, data]) => (
                <div key={obj}>
                  <h4 className="font-semibold capitalize">{obj}</h4>
                  {data.isLoading ? (
                     <div className="space-y-2 mt-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                     </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {data.suggestions.map((suggestion, i) => (
                        <Badge key={i} variant="outline" className="text-sm py-1 px-3">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Analysis</CardTitle>
        <CardDescription>
          Here is what Visionary detected in the image.
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default AnalysisResults;
