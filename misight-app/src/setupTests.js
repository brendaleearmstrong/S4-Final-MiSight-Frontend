import '@testing-library/jest-dom';
import { vi } from 'vitest';

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
global.localStorage = localStorageMock;

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});