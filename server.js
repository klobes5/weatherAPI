/***************************
 * DO NOT CHANGE THIS FILE *
 ***************************/

import { createServer } from 'http';
import handler from './index';

const PORT = 8000; // Required port for HackerRank

const server = createServer(handler)
  .on('listening', () => {
    const { port } = server.address();
    console.log(`Server listening on port ${port}`);
  })
  .on('close', () => console.log('Server closed.'));

console.log(`Binding to port ${PORT}`)
server.listen(PORT);
