"use client"

import * as React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-white shadow-sm ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={`p-6 ${className}`} {...props} />
}

export function CardTitle({ className, ...props }: CardProps) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}