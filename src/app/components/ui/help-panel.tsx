import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpContent {
  title: string;
  description: string;
}

interface HelpPanelProps {
  section: {
    title: string;
    content: HelpContent[];
  };
}

export function HelpPanel({ section }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 w-96 p-4 mt-2 bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {section.content.map((helpContent, index) => (
              <div key={index} className="space-y-1">
                <h4 className="font-medium">{helpContent.title}</h4>
                <p className="text-sm text-gray-600">{helpContent.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}