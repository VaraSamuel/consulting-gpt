// MSW server setup for Node.js environment (Jest tests)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup server with handlers
export const server = setupServer(...handlers);
