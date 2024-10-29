"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Dropdown({ trigger, children, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className={`absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${className}`}>
          <div className="py-1" role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode
  onClick?: () => void 
}) {
  return (
    <div
      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
      role="menuitem"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
