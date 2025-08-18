import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import Loader from './Loader';

interface LazyComponentProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface LazyComponentState {
    hasError: boolean;
    error?: Error;
}

class LazyComponent extends Component<LazyComponentProps, LazyComponentState> {
    constructor(props: LazyComponentProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): LazyComponentState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('LazyComponent error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Failed to load component</p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <Suspense fallback={this.props.fallback || <Loader />}>
                {this.props.children}
            </Suspense>
        );
    }
}

export default LazyComponent;
