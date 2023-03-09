const express = require('express');
var cors = require('cors');
// const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const sessions = {};

app.post('/position', (req, res) => {
  const sessionId = Math.random().toString(36).substring(2, 15);
  sessions[sessionId] = 'Ready';


  let count = 0;
  let intervalId = setInterval(() => {
    if (sessions[sessionId] === 'Ready') {
      sessions[sessionId] = 'Transmitted';
    } else if (count === 1) {
      sessions[sessionId] = 'Acknowledged';
    }
    else if (count === 2) {
      sessions[sessionId] = 'Executed';
    }
    if (sessions[sessionId] === 'Executed') {
      clearInterval(intervalId);
      res.end();
    }
    if (sessions[sessionId] === 'Failed') {
      clearInterval(intervalId);
      res.end();
    }
    count++;
  }, 10000);


  res.json({ sessionId });
});

app.get('/position/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const status = sessions[sessionId];

  if (!status) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ status });
});

app.delete('/position/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  const status = sessions[sessionId];
  
  if (!status) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if ((status === 'Ready') || (status === 'Transmitted')){
    sessions[sessionId] = 'Failed';
    res.end('Failed')
  }
  else {
    return res.json( {error: 'Process cannot be deleted' })
  }

  
});

app.listen(4000, () => console.log('Server started on port 4000'));
