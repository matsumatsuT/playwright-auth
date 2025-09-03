# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Playwright-based testing project focused on authentication testing. The codebase demonstrates how to use Playwright's authentication state management to test logged-in user scenarios across various services (Amazon, Google, LinkedIn, Yahoo).

## Commands

### Testing
- `pnpm exec playwright test --ui` - Run tests with Playwright Test UI
- `pnpm exec playwright test` - Run all tests in headless mode
- `pnpm exec playwright test tests/example.spec.ts` - Run specific test file

### Authentication State Management
The project uses Playwright's `storageState` feature to persist authentication cookies between test runs. Authentication states are stored in `playwright/.auth/` directory.

## Architecture

### Core Components

**Configuration**
- `playwright.config.ts` - Main Playwright configuration with Japanese locale (ja-JP) and Asia/Tokyo timezone
- `.env` - Contains authentication credentials for various services (Google, MoneyForward)
- `auth-cookies.json` - Stores authentication cookies for multiple services

**Test Structure**
- `tests/` - Main test directory
- `tests/example.spec.ts` - Amazon authentication test using stored state
- `tests-examples/` - Contains Playwright demo tests for reference

**Authentication Flow**
- Tests use `test.use({ storageState: 'playwright/.auth/amazon-state.json' })` to load pre-saved authentication states
- Authentication states are stored as JSON files containing cookies and session data
- The project supports multiple services: Amazon, Google, LinkedIn, Yahoo

### Key Patterns

**Authentication Testing**
- Tests verify authentication by checking for absence of login UI elements
- Uses negative assertions (`.not.toBeVisible()`) to confirm successful login state
- Extracts and logs user account information to verify correct authentication

**Environment Configuration**
- Configured for Japanese locale testing
- Uses pnpm for package management
- Only runs on Chromium browser (other browsers commented out)
- CI/CD ready with conditional retry and worker settings

## Development Notes

- Authentication credentials are stored in `.env` file (excluded from git)
- Cookie states are maintained in `auth-cookies.json` for persistent sessions
- Tests are designed to run independently using pre-authenticated states
- The project demonstrates authentication persistence across browser sessions