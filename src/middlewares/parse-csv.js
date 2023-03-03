import fs from 'node:fs/promises';

import { parse } from 'csv-parse';

const csvPath = new URL('../../tasks.csv', import.meta.url);

export function parseCSV(database) {
  return async function parseStream(req, res) {
    try {
      const csv = await fs.readFile(csvPath, 'utf-8');
      const csvReadableStream = parse(csv);

      let count = 0;
      for await (const chunk of csvReadableStream) {
        const [title, description] = chunk;

        if (count) {
          database.insert('tasks', { title, description });
        }

        count++;
      }

      res.writeHead(201).end();
    } catch (_) {
      res.writeHead(500).end('CSV file doesn`t exist');
    }
  };
}
