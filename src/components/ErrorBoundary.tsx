import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center justify-center size-20 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
              <AlertCircle className="size-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Something went wrong</h1>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              An unexpected error occurred while rendering this page. We've been notified and are looking into it.
            </p>
            {this.state.error && (
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-[10px] font-mono text-red-400 text-left overflow-auto max-h-32">
                    {this.state.error.toString()}
                </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
              <RefreshCw className="size-4" />
              Reload Application
            </button>
            <button
               onClick={() => {
                   localStorage.clear();
                   window.location.href = '/login';
               }}
               className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
                Clear Data & Sign Out
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
