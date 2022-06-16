import express, { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      // READ THE File
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      res.send(JSON.parse(result));
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // ENOENT means file doesn't exist
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw err;
      }
    }

    // IF READ THROWS AN ERROR, CHECK IF IT DOESN'T EXIST
    // PARSE A LIST OF CELLS BACK TO BROWSER
    // SEND LIST OF CELLS BACK TO BROWSER
  });
  router.post('/cells', async (req, res) => {
    // TAKE THE LIST OF CELLS FROM THE REQUEST OBJECT
    // SERIALIZE THEM
    const { cells }: { cells: Cell[] } = req.body;

    // WRITE THE CELLS INTO THE FILE
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
    res.send({ status: 'ok' });
  });

  return router;
};
