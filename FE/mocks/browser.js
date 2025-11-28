// src/mocks/browser.js
import { setupWorker } from 'msw';
import { loginHandlers, SignUpHandlers, userHandlers } from './handlers/mkHandlers';
// import {} from './handlers/shHandlers';

export const worker = setupWorker(...loginHandlers, ...SignUpHandlers, ...userHandlers);
