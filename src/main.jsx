import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", background: "#fff1f0", minHeight: "100svh" }}>
          <h2 style={{ color: "#c00" }}>App-Fehler</h2>
          <p style={{ fontSize: 14, color: "#333" }}>Bitte diesen Text kopieren:</p>
          <pre style={{ background: "#fff", padding: 16, borderRadius: 8, fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-all", border: "1px solid #fca5a5" }}>
            {this.state.error?.toString()}{"\n\n"}{this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
