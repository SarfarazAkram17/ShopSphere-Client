# Test Suite Documentation

## Overview
This project uses Vitest as the test runner and React Testing Library for component testing.

## Running Tests

### Run all tests
\`\`\`bash
npm test
\`\`\`

### Run tests in watch mode
\`\`\`bash
npm test -- --watch
\`\`\`

### Run tests with UI
\`\`\`bash
npm run test:ui
\`\`\`

### Run tests with coverage
\`\`\`bash
npm run test:coverage
\`\`\`

## Test Structure

### Component Tests
- Located in `__tests__` directories next to components
- Test user interactions, rendering, and props
- Use React Testing Library queries

### Hook Tests
- Located in `Hooks/__tests__/`
- Test hook logic and state management
- Use `renderHook` from React Testing Library

### Integration Tests
- Located in page component directories
- Test complete user flows
- Mock external dependencies

## Best Practices

1. **Test user behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`
   - Avoid `getByTestId` when possible

3. **Mock external dependencies**
   - API calls
   - Router navigation
   - Authentication context

4. **Keep tests isolated**
   - Clean up after each test
   - Don't rely on test execution order

## Coverage Goals
- Aim for >80% coverage on new code
- Focus on critical paths and edge cases
- All public interfaces should be tested