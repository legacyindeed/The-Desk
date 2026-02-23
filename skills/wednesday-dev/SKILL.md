---
name: wednesday-dev
description: Technical development guidelines and engineering standards. Use for ensuring code quality, low complexity, and consistent naming across React and TypeScript projects.
---

# Wednesday Development Standards

This skill provides mandatory guidelines for technical development to ensure high-quality, maintainable code.

## Engineering Principles

1. **Keep it Simple**: Avoid over-engineering. Favor readable code over clever code.
2. **Deterministic Logic**: Favor pure functions and deterministic logic in the execution layer.
3. **Consistency**: Follow project naming and structural conventions strictly.

## Standards

### 1. Cyclomatic Complexity
- **Limit**: Maximum of 8 per function.
- If a function exceeds this limit, refactor into smaller, focused helpers.

### 2. Naming Conventions
- **React Components**: PascalCase (e.g., `DashboardCard.jsx`)
- **Functions/Variables**: camelCase (e.g., `fetchUserData`)
- **Constants/Enums**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **CSS Classes**: Kebab-case (e.g., `.btn-primary-fancy`)

### 3. Import Ordering
1. React and system hooks
2. External libraries
3. Internal components
4. Stylesheets (`.css`)

### 4. React Patterns
- Favor functional components and hooks.
- Keep components small and focused on a single responsibility.
- Use `useMemo` and `useCallback` strategically for performance in complex renders.

### 5. Testing
- Write descriptive unit tests for all business logic in the execution layer.
- Ensure 100% path coverage for critical utility functions.
