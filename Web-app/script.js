// Importing required modules
const http = require('http');
const fs = require('fs');
const url = require('url');

// Array to store tasks
let tasks = [];

// Function to handle HTTP requests
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url, true);

    // Route for serving HTML page for task manager
    if (parsedUrl.pathname === '/' && req.method === 'GET') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Route for adding new tasks
    else if (parsedUrl.pathname === '/addTask' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const task = JSON.parse(body).task;
            if (task.trim() !== '') {
                tasks.push({ name: task, completed: false });
            }
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }

    // Route for getting tasks
    else if (parsedUrl.pathname === '/getTasks' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    // Route for marking a task as completed
    else if (parsedUrl.pathname.startsWith('/completeTask/') && req.method === 'PUT') {
        const taskId = parseInt(parsedUrl.pathname.split('/')[2]);
        if (taskId >= 0 && taskId < tasks.length) {
            tasks[taskId].completed = true;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Task marked as completed.');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Task not found.');
        }
    }

    // Route not found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
