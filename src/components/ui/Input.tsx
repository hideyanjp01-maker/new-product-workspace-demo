import { InputHTMLAttributes, forwardRef } from 'react'
import './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="ui-input-wrapper">
        {label && <label className="ui-input-label">{label}</label>}
        <input
          ref={ref}
          className={`ui-input ${error ? 'ui-input--error' : ''} ${className}`}
          {...props}
        />
        {error && <span className="ui-input-error">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input





