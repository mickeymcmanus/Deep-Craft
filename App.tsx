import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Visualization } from './components/Visualization';
import { ScrollContent } from './components/ScrollContent';
import { STEPS } from './constants';
import type { ScrollStep } from './types';

const App: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(STEPS[0].id);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleStepChange = useCallback((stepId: number) => {
        setActiveStep(stepId);
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when a step is at the vertical center of the viewport
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepId = parseInt(entry.target.getAttribute('data-step-id') || '0', 10);
                    handleStepChange(stepId);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRefs = stepRefs.current;
        currentRefs.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            currentRefs.forEach(ref => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [handleStepChange]);

    // Calculate the zoom level based on scroll progress.
    // The zoom completes on the last meaningful content step.
    const lastContentStepId = STEPS.find(s => s.title === "The Power of the Framework")?.id || 9;
    const progress = Math.min(activeStep / lastContentStepId, 1);
    const initialScale = 0.65;
    const finalScale = 1.0;
    const scale = initialScale + (finalScale - initialScale) * progress;


    return (
        <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
            <header className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm text-center py-3 border-b border-gray-200/50">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 animate-fade-in">
                    Deep Craft
                </h1>
                <p className="mt-2 text-lg md:text-xl text-gray-600 animate-fade-in-delay opacity-0 fill-mode-forwards">
                    A Framework for Strategic Innovation
                </p>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 flex-grow">
                {/* Visualization container: made sticky below the header */}
                <div className="sticky top-36 lg:top-40 h-[40vh] lg:h-[50vh] flex items-center justify-center py-4">
                    <Visualization activeStep={activeStep} scale={scale} />
                </div>
                <div className="relative z-0 py-8 lg:py-16">
                    <ScrollContent steps={STEPS} activeStep={activeStep} stepRefs={stepRefs} />
                    {/* Add a spacer to ensure the final step can be centered */}
                    <div className="h-[60vh]" />
                </div>
            </main>
            <footer className="text-center py-6 px-4 text-gray-500 text-sm bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50">
                <p>
                    The Deep Craft framework was developed by Venkatesh Narayanamurti and Jeffrey Y. Tsao.
                </p>
                <p className="mt-1">
                    It is detailed in their book,{' '}
                    <a 
                        href="https://www.hup.harvard.edu/books/9780674971844" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline"
                    >
                        <em>The Genesis of Technoscientific Revolutions</em>
                    </a>
                    , published by Harvard University Press.
                </p>
            </footer>
        </div>
    );
};

export default App;