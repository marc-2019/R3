// src/components/data/DataPageContent.tsx
'use client';

import ErrorBoundary from '@/components/ui/error-boundary';
import { PermissionManagement } from '@/components/permissions';

export default function DataPageContent() {
  return (
    <ErrorBoundary>
      <PermissionManagement />
    </ErrorBoundary>
  );
}