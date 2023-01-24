const express = require('express');
const morgan = require('morgan');
const app = express();

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ');
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send("<h1>Phonebook app</h1>");
})

app.get('/info', (request, response) => {
    const body = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `;
    response.send(body)
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send('This person does not exist in the phonebook');
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    let id = generateId();
    const person = {...request.body, id, date: new Date()};
    if (!person.name || !person.number) {
        return response.status(400).json({error: "name and/or number is missing"});
    }

    if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({error: "name already exists"});
    }
    persons = persons.concat(person);
    response.json(person);

})

const generateId = () => {
    const generate = () => Math.ceil(Math.random() * 10000);
    const ids = persons.map(p => p.id);
    let id = generate();
    
    while (ids.find(i => i === id)) {
        id = generate();
    }

    return id;

};



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`running on ${PORT}`);
})