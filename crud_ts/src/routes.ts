import { Router } from 'express';
import mysql from 'mysql';
const router = Router();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ts_crud'
});
connection.connect();

// Rota de índice
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Example route for creating an item
router.get('/item', (req, res) => {
  const { name, description } = req.query;
  if (!name || !description) {
    return res.status(400).send('Name and description are required');
  }
  connection.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(result);
    }
  });
});

router.get('/leitura', (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('ID parameter is required');
  }

  // Consulta SQL para buscar o item pelo ID
  connection.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(404).send('No item found with the provided ID');
    }

    // Retorna o item encontrado
    res.json(results[0]);
  });
});

router.get('/atualizar', (req, res) => {
  const id = req.query.id;
  const newName = req.query.name;

  if (!id || !newName) {
    return res.status(400).send('ID and new name parameters are required');
  }

  // Consulta SQL para atualizar o nome do item pelo ID
  connection.query('UPDATE items SET name = ? WHERE id = ?', [newName, id], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('No item found with the provided ID');
    }

    // Confirmação de atualização
    res.send('Item updated successfully');
  });
});

router.get('/excluir', (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('ID parameter is required');
  }

  // Consulta SQL para excluir o item pelo ID
  connection.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('No item found with the provided ID');
    }

    // Confirmação de exclusão
    res.send('Item deleted successfully');
  });
});

// More CRUD routes...
export default router;