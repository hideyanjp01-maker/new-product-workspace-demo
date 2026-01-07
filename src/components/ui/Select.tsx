import { SelectHTMLAttributes, forwardRef } from 'react'
import './Select.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="ui-select-wrapper">
        {label && <label className="ui-select-label">{label}</label>}
        <select
          ref={ref}
          className={`ui-select ${error ? 'ui-select--error' : ''} ${className}`}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="ui-select-error">{error}</span>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select





