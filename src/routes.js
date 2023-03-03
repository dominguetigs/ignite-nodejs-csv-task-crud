import { buildRoutePath } from './utils/build-route-path.js';
import { Database } from './database.js';
import { parseCSV } from './middlewares/parse-csv.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        'tasks',
        search ? { title: search, description: search } : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      return parseCSV(database)(req, res);
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;

      if (title && description) {
        const updatedTask = database.update('tasks', id, { title, description });
        return updatedTask ? res.writeHead(204).end() : res.writeHead(404).end();
      }

      return res.writeHead(400).end('Fields title and description are required');
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const deletedTask = database.delete('tasks', id);
      return deletedTask ? res.writeHead(204).end() : res.writeHead(404).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;
      const updatedTask = database.update('tasks', id, { completed_at: new Date() });
      return updatedTask ? res.writeHead(204).end() : res.writeHead(404).end();
    },
  },
];
