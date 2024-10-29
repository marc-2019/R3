# R3 Testing Setup Guide

## Initial Setup

1. Install required dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom ts-jest @types/jest
```

2. Configure Jest in package.json (see package.json for full configuration)

3. Create jest-setup.js in project root:
```javascript
require('@testing-library/jest-dom');
```

4. Create test files in `src/__tests__` directory with `.test.ts` or `.test.tsx` extension

## Running Tests

- Run tests once: `npm test`
- Run tests in watch mode: `npm run test:watch`

## Writing Tests

Basic test template:
```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Component Name', () => {
  it('should render correctly', () => {
    // Test code here
  })
})
```

## CI Pipeline

Tests are automatically run in GitHub Actions when:
- Pushing to main or develop branches
- Creating pull requests to these branches

## Troubleshooting

Common issues:
1. Module import errors: Check moduleNameMapper in jest config
2. TypeScript errors: Ensure ts-jest is properly configured
3. DOM-related errors: Verify jest-environment-jsdom is installed
