// src/components/ui/help-panel.tsx

'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function HelpPanel({ section }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg z-50"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{content.title}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{content.description}</p>

          <div className="space-y-4">
            {content.sections.map((section, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
