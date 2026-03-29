import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={18} className="text-brand-red" />
            <span className="text-sm font-semibold text-brand-red">
              {this.props.section || "Section"} Error
            </span>
          </div>
          <p className="text-[13px] text-text-secondary mb-4">
            Something went wrong loading this section.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 text-xs text-brand-amber bg-brand-amber-dim px-3.5 py-2 rounded-lg
                       cursor-pointer border-none font-semibold transition-all duration-200 hover:bg-brand-amber-glow">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
