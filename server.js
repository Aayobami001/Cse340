const express = require("express");
const path = require("path");

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
// Define the port number the server will listen on
const port = process.env.PORT || 3000;

const app = express();

/**
  Configure Express middleware
*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const title = 'Service Categories';
    res.render('categories', { title });
});

app.listen(port, () => {
  console.log(`Server is running at localhost:${port}`);
  console.log(`Environment: ${NODE_ENV}`);
});
