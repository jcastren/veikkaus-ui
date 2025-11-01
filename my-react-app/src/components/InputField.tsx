import React from 'react'

// Define the props for the InputField, extending standard HTML input attributes
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function InputField({ value, onChange, ...rest }: InputFieldProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      {...rest} // Spread the rest of the props (like placeholder, className)
      className={`p-2 border rounded ${rest.className || ''}`}
    />
  )
}
