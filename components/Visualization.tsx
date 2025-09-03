import React from 'react';

interface VisualizationProps {
    activeStep: number;
    scale: number;
}

const getAriaDescription = (step: number): string => {
    switch (step) {
        case 0: return "The grid is empty, showing only the title 'Deep Craft'.";
        case 1: return "The vertical axis, labeled 'Innovator Informedness' with 'Low' at the bottom, has appeared.";
        case 2: return "The vertical axis now shows 'High' at the top.";
        case 3: return "The horizontal axis, labeled 'Consistency with Conventional Wisdom' with 'High' on the left, has appeared.";
        case 4: return "The horizontal axis now shows 'Low' on the right.";
        case 5: return "The bottom-left quadrant is highlighted and labeled 'Plausible - Obvious'.";
        case 6: return "The top-left quadrant is highlighted and labeled 'Dead on Arrival'.";
        case 7: return "The bottom-right quadrant is highlighted and labeled 'Hail Mary'.";
        case 8: return "The top-right quadrant is highlighted and labeled 'Deep Craft'.";
        case 9:
        case 10:
             return "The full Deep Craft diagram is now displayed, with the 'Deep Craft' quadrant emphasized.";
        default: return "The Deep Craft diagram.";
    }
}

const AnimatedText: React.FC<{ children: React.ReactNode; show: boolean; className?: string; isQuadrant?: boolean }> = ({ children, show, className = '', isQuadrant = false }) => {
    const quadrantClasses = 'text-center p-2 text-blue-900';
    const finalClassName = `
        transition-all duration-500
        ${isQuadrant ? quadrantClasses : ''}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${className}
    `;
    return <div className={finalClassName}>{children}</div>;
};

export const Visualization: React.FC<VisualizationProps> = ({ activeStep, scale }) => {
    const axisLabelClass = "absolute text-gray-500";
    const quadrantContainerClass = "absolute inset-0 grid grid-cols-2 grid-rows-2 p-4";

    const getQuadrantClasses = (quadrantTriggerStep: number, isDeepCraft: boolean = false) => {
        const baseClasses = ['flex', 'items-center', 'justify-center', 'transition-colors', 'duration-500'];
        if (isDeepCraft) {
            baseClasses.push('flex-col');
        }

        // Highlight for the step that introduces the quadrant
        if (activeStep === quadrantTriggerStep) {
            baseClasses.push(isDeepCraft ? 'bg-amber-100' : 'bg-blue-100');
        }
        
        // Special final state for Deep Craft quadrant
        if (isDeepCraft && (activeStep === 9 || activeStep === 10)) {
            // Ensure background is set before animation
            baseClasses.push('bg-amber-100', 'animate-pulse-glow');
        }

        return baseClasses.join(' ');
    }

    const ariaDescription = getAriaDescription(activeStep);

    return (
        <div 
            className="w-full max-w-md lg:max-w-lg aspect-square relative text-sm sm:text-base transition-transform duration-700 ease-in-out mx-auto"
            style={{ transform: `scale(${scale})` }}
            role="graphics-document"
            aria-label="A 2 by 2 grid for the Deep Craft framework."
            aria-describedby="viz-description"
        >
            <span id="viz-description" className="sr-only" aria-live="polite">
                {ariaDescription}
            </span>

            {/* Grid Lines */}
            <div className="absolute inset-0 bg-white rounded-lg border border-gray-300" aria-hidden="true">
                <div className="w-full h-1/2 border-b border-gray-300"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-gray-300"></div>
            </div>

            {/* Y-Axis Arrow & Labels */}
            <div className="absolute -left-4 top-0 bottom-0 flex items-center">
                <div className="relative h-full">
                    <AnimatedText show={activeStep >= 1} className="absolute -left-28 top-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap">
                        Innovator Informedness
                    </AnimatedText>
                    <div aria-hidden="true" className={`absolute -left-1 top-2 bottom-2 w-px bg-gray-400 transition-opacity duration-500 ${activeStep >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <AnimatedText show={activeStep >= 2} className={`${axisLabelClass} -left-14 top-2`}>High</AnimatedText>
                    <AnimatedText show={activeStep >= 1} className={`${axisLabelClass} -left-14 bottom-2`}>Low</AnimatedText>
                </div>
            </div>

            {/* X-Axis Arrow & Labels */}
            <div className="absolute -bottom-4 left-0 right-0 flex items-center">
                <div className="relative w-full">
                    <AnimatedText show={activeStep >= 3} className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap">
                       Consistency with Conventional Wisdom
                    </AnimatedText>
                    <div aria-hidden="true" className={`absolute bottom-[-1px] left-2 right-2 h-px bg-gray-400 transition-opacity duration-500 ${activeStep >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    <AnimatedText show={activeStep >= 3} className={`${axisLabelClass} bottom-[-2.5rem] left-4`}>High</AnimatedText>
                    <AnimatedText show={activeStep >= 4} className={`${axisLabelClass} bottom-[-2.5rem] right-4`}>Low</AnimatedText>
                </div>
            </div>

            {/* Quadrant Labels */}
            <div className={quadrantContainerClass}>
                {/* Top Left */}
                <div className={getQuadrantClasses(6)}>
                    <AnimatedText show={activeStep >= 6} isQuadrant>
                        <h3 className="font-bold">Dead on Arrival</h3>
                    </AnimatedText>
                </div>
                {/* Top Right */}
                <div className={getQuadrantClasses(8, true)}>
                     <AnimatedText show={activeStep >= 8} isQuadrant>
                        <h3 className="font-bold text-lg text-amber-700">Deep Craft</h3>
                        <p className="text-xs text-amber-800">Implausible Utility -<br/>Strategic Surprise</p>
                    </AnimatedText>
                </div>
                {/* Bottom Left */}
                <div className={getQuadrantClasses(5)}>
                    <AnimatedText show={activeStep >= 5} isQuadrant>
                        <h3 className="font-bold">Plausible - Obvious</h3>
                    </AnimatedText>
                </div>
                {/* Bottom Right */}
                <div className={getQuadrantClasses(7)}>
                    <AnimatedText show={activeStep >= 7} isQuadrant>
                        <h3 className="font-bold">Hail Mary</h3>
                    </AnimatedText>
                </div>
            </div>
        </div>
    );
};