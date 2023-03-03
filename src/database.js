import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch((_) => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    data = {
      id: randomUUID(),
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
      ...data,
    };

    if (this.#database[table]) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const hasRow = rowIndex > -1;

    if (hasRow) {
      const updatedData = {
        ...this.#database[table][rowIndex],
        ...data,
        id,
        updated_at: new Date(),
      };
      this.#database[table][rowIndex] = updatedData;
      this.#persist();
    }

    return hasRow;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const hasRow = rowIndex > -1;

    if (hasRow) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }

    return hasRow;
  }
}
