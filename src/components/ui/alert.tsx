// src/components/ui/alert.tsx
"use client"

import * as React from "react"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error"
}

export function Alert({ className = "", variant = "default", ...props }: AlertProps) {
  const icons = {
    default: AlertCircle,
    success: CheckCircle,
    error: XCircle
  }

  const Icon = icons[variant]
  const variantStyles = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <div
      className={`p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div>{props.children}</div>
      </div>
    </div>
  )
}

export function AlertTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`font-medium leading-none tracking-tight ${className}`} {...props} />
  )
}

export function AlertDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
}