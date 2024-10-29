"use client"

import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({
  className = "",
  type = "text",
  label,
  error,
  icon,
  ...props
}: InputProps) {
  const id = React.useId()
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-300 text-red-900 placeholder-red-300" : ""}
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
