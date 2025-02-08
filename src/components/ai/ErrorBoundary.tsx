import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('AI Error:', error, info)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
