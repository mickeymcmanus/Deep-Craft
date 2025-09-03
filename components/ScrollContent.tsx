import React from 'react';
import type { ScrollStep } from '../types';

interface ScrollContentProps {
    steps: ScrollStep[];
    activeStep: number;
    stepRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const ScrollContent: React.FC<ScrollContentProps> = ({ steps, activeStep, stepRefs }) => {
    return (
        <div role="list" className="flex flex-col space-y-72">
            {steps.map((step, index) => {
                // If the step is empty (the final trigger), render an invisible div
                if (!step.title) {
                    return (
                        <div
                            key={step.id}
                            ref={el => {
                                if (stepRefs.current) {
                                    stepRefs.current[index] = el;
                                }
                            }}
                            data-step-id={step.id}
                            className="h-1" // Minimal height to be detected by IntersectionObserver
                        />
                    );
                }

                const isActive = activeStep === step.id;
                return (
                    <div
                        key={step.id}
                        ref={el => {
                            if (stepRefs.current) {
                                stepRefs.current[index] = el;
                            }
                        }}
                        data-step-id={step.id}
                        role="listitem"
                        aria-current={isActive ? "step" : undefined}
                        className={`transition-all duration-500 p-6 rounded-lg ${isActive ? 'opacity-100 scale-100 bg-white shadow-lg' : 'opacity-50 scale-95'}`}
                    >
                        <h2 className="text-2xl font-bold text-blue-800 mb-3">{step.title}</h2>
                        <p className="text-gray-700 leading-relaxed">{step.description}</p>
                    </div>
                );
            })}
        </div>
    );
};