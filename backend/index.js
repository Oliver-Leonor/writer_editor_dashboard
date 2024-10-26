// mock-server/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001; // Choose a different port from your main backend

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let users = [
  {
    id: 1,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    password: "editorpass", // Plain text for mock purposes
    type: "Editor",
    status: "Active",
  },
  {
    id: 2,
    firstname: "Writer",
    lastname: "User",
    email: "writer@example.com",
    password: "writerpass", // Plain text for mock purposes
    type: "Writer",
    status: "Active",
  },
];

let companies = [
  {
    id: 1,
    logo: "https://via.placeholder.com/50",
    name: "Example Company",
    status: "Active",
  },
  {
    id: 2,
    logo: "https://via.placeholder.com/50",
    name: "Another Company",
    status: "Active",
  },
];

let articles = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    title: "First Article",
    link: "https://example.com/first-article",
    date: "2023-10-22",
    content: "This is the first article content.",
    status: "For Edit",
    writerId: 2, // References Writer User
    editorId: null,
    companyId: 1,
  },
];

// Simple Token Generation (For Mock Only)
const generateToken = (user) => {
  return `mock-token-${user.id}`;
};

// Middleware to Authenticate Requests
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided." });
  const token = authHeader.split(" ")[1];
  const userId = parseInt(token.split("-")[2]);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ message: "Invalid token." });
  req.user = user;
  next();
};

// Auth Routes

// Login Route
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials." });
  const token = generateToken(user);
  res.json({
    auth: true,
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      type: user.type,
    },
  });
});

// Get Current User
app.get("/auth/user", authenticate, (req, res) => {
  const { id, firstname, lastname, type } = req.user;
  res.json({ id, firstname, lastname, type });
});

// User Routes (Editors Only)
app.get("/users", authenticate, (req, res) => {
  if (req.user.type !== "Editor")
    return res.status(403).json({ message: "Access denied." });
  res.json(users);
});

app.post("/users", authenticate, (req, res) => {
  if (req.user.type !== "Editor")
    return res.status(403).json({ message: "Access denied." });
  const { firstname, lastname, email, password, type, status } = req.body;
  const existingUser = users.find((u) => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: "User already exists." });
  const newUser = {
    id: users.length + 1,
    firstname,
    lastname,
    email,
    password,
    type,
    status,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Articles Routes
app.get("/articles", authenticate, (req, res) => {
  res.json(articles);
});

app.post("/articles", authenticate, (req, res) => {
  if (req.user.type !== "Writer")
    return res.status(403).json({ message: "Access denied." });
  const { image, title, link, date, content, companyId } = req.body;
  const newArticle = {
    id: articles.length + 1,
    image,
    title,
    link,
    date,
    content,
    status: "For Edit",
    writerId: req.user.id,
    editorId: null,
    companyId,
  };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Update Article
app.put("/articles/:id", authenticate, (req, res) => {
  const article = articles.find((a) => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).json({ message: "Article not found." });

  if (req.user.type === "Writer") {
    if (article.writerId !== req.user.id || article.status !== "For Edit") {
      return res.status(403).json({ message: "Access denied." });
    }
    const { image, title, link, date, content, companyId } = req.body;
    if (image) article.image = image;
    if (title) article.title = title;
    if (link) article.link = link;
    if (date) article.date = date;
    if (content) article.content = content;
    if (companyId) article.companyId = companyId;
    res.json(article);
  } else if (req.user.type === "Editor") {
    const { status } = req.body;
    if (status && status === "Published") {
      article.status = "Published";
      article.editorId = req.user.id;
      res.json(article);
    } else {
      res.status(400).json({ message: "Invalid status update." });
    }
  } else {
    res.status(403).json({ message: "Access denied." });
  }
});

// Delete Article (Editors Only)
app.delete("/articles/:id", authenticate, (req, res) => {
  if (req.user.type !== "Editor")
    return res.status(403).json({ message: "Access denied." });
  const articleIndex = articles.findIndex(
    (a) => a.id === parseInt(req.params.id)
  );
  if (articleIndex === -1)
    return res.status(404).json({ message: "Article not found." });
  articles.splice(articleIndex, 1);
  res.json({ message: "Article deleted." });
});

// Companies Routes (Editors and Writers)
app.get("/companies", authenticate, (req, res) => {
  if (req.user.type !== "Editor" && req.user.type !== "Writer") {
    return res.status(403).json({ message: "Access denied." });
  }
  res.json(companies);
});

app.post("/companies", authenticate, (req, res) => {
  if (req.user.type !== "Editor")
    return res.status(403).json({ message: "Access denied." });
  const { logo, name, status } = req.body;
  const existingCompany = companies.find((c) => c.name === name);
  if (existingCompany)
    return res.status(400).json({ message: "Company already exists." });
  const newCompany = {
    id: companies.length + 1,
    logo,
    name,
    status,
  };
  companies.push(newCompany);
  res.status(201).json(newCompany);
});

app.put("/companies/:id", authenticate, (req, res) => {
  if (req.user.type !== "Editor")
    return res.status(403).json({ message: "Access denied." });
  const company = companies.find((c) => c.id === parseInt(req.params.id));
  if (!company) return res.status(404).json({ message: "Company not found." });
  const { logo, name, status } = req.body;
  if (logo) company.logo = logo;
  if (name) company.name = name;
  if (status) company.status = status;
  res.json(company);
});

// Start the Mock Server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
