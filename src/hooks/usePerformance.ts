import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
    componentName: string;
    loadTime: number;
    timestamp: string;
    userAgent: string;
    url: string;
}

export const usePerformance = (componentName: string) => {
    const startTime = useRef(performance.now());
    const hasReported = useRef(false);

    useEffect(() => {
        const reportPerformance = () => {
            if (hasReported.current) return;

            const loadTime = performance.now() - startTime.current;
            hasReported.current = true;

            const metrics: PerformanceMetrics = {
                componentName,
                loadTime,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Log performance in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`Performance: ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
            }

            // Report to analytics in production
            if (process.env.NODE_ENV === 'production' && loadTime > 1000) {
                // Only report slow loads
                fetch('/api/performance-log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(metrics)
                }).catch(console.error);
            }
        };

        // Report after component mounts
        const timer = setTimeout(reportPerformance, 0);

        return () => {
            clearTimeout(timer);
            reportPerformance();
        };
    }, [componentName]);

    return {
        startTime: startTime.current,
        reportPerformance: () => {
            hasReported.current = false;
            startTime.current = performance.now();
        }
    };
};
