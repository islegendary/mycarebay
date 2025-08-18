export interface ErrorLog {
    message: string;
    stack?: string;
    componentStack?: string;
    timestamp: string;
    userAgent: string;
    url: string;
    userId?: string;
    errorType: 'react' | 'api' | 'runtime' | 'network';
    severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorService {
    private static instance: ErrorService;
    private errorQueue: ErrorLog[] = [];
    private isProcessing = false;

    private constructor() {
        // Set up global error handlers
        this.setupGlobalErrorHandlers();
    }

    static getInstance(): ErrorService {
        if (!ErrorService.instance) {
            ErrorService.instance = new ErrorService();
        }
        return ErrorService.instance;
    }

    private setupGlobalErrorHandlers() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                errorType: 'runtime',
                severity: 'high'
            });
        });

        // Handle global JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError({
                message: event.message,
                stack: event.error?.stack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                errorType: 'runtime',
                severity: 'high'
            });
        });
    }

    logError(errorData: Partial<ErrorLog>): void {
        const errorLog: ErrorLog = {
            message: errorData.message || 'Unknown error',
            stack: errorData.stack,
            componentStack: errorData.componentStack,
            timestamp: errorData.timestamp || new Date().toISOString(),
            userAgent: errorData.userAgent || navigator.userAgent,
            url: errorData.url || window.location.href,
            userId: errorData.userId || this.getCurrentUserId(),
            errorType: errorData.errorType || 'runtime',
            severity: errorData.severity || 'medium'
        };

        // Always log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error logged:', errorLog);
        }

        // Add to queue for batch processing
        this.errorQueue.push(errorLog);
        this.processErrorQueue();
    }

    private getCurrentUserId(): string | undefined {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user).id : undefined;
        } catch {
            return undefined;
        }
    }

    private async processErrorQueue(): Promise<void> {
        if (this.isProcessing || this.errorQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        try {
            // Process errors in batches
            const batch = this.errorQueue.splice(0, 10);

            if (process.env.NODE_ENV === 'production') {
                await this.sendErrorsToServer(batch);
            }
        } catch (error) {
            console.error('Failed to process error queue:', error);
        } finally {
            this.isProcessing = false;

            // Process remaining errors if any
            if (this.errorQueue.length > 0) {
                setTimeout(() => this.processErrorQueue(), 1000);
            }
        }
    }

    private async sendErrorsToServer(errors: ErrorLog[]): Promise<void> {
        try {
            await fetch('/api/error-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errors })
            });
        } catch (error) {
            console.error('Failed to send errors to server:', error);
            // Re-queue errors for retry
            this.errorQueue.unshift(...errors);
        }
    }

    // Utility methods for different error types
    logApiError(error: any, endpoint: string): void {
        this.logError({
            message: `API Error: ${endpoint} - ${error.message}`,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errorType: 'api',
            severity: 'medium'
        });
    }

    logReactError(error: Error, errorInfo: React.ErrorInfo): void {
        this.logError({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errorType: 'react',
            severity: 'high'
        });
    }

    logNetworkError(error: any, url: string): void {
        this.logError({
            message: `Network Error: ${url} - ${error.message}`,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            errorType: 'network',
            severity: 'medium'
        });
    }
}

export default ErrorService.getInstance();
