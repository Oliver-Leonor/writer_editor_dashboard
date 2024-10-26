// backend/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure key in production

app.use(cors());
app.use(bodyParser.json());

// Sample Users (In production, use a database)
const users = [
  {
    id: 1,
    firstname: "Writer",
    lastname: "User",
    email: "writer@example.com",
    password: bcrypt.hashSync("writerpass", 8), // Hashed password
    type: "Writer",
    status: "Active",
  },
  {
    id: 2,
    firstname: "Editor",
    lastname: "User",
    email: "editor@example.com",
    password: bcrypt.hashSync("editorpass", 8), // Hashed password
    type: "Editor",
    status: "Active",
  },
];

// Middleware to Verify JWT
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    req.userId = decoded.id;
    next();
  });
}

// Login Route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).send("No user found.");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res
      .status(401)
      .send({ auth: false, token: null, message: "Invalid Password!" });
  }

  const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, {
    expiresIn: 86400, // 24 hours
  });

  res.status(200).send({
    auth: true,
    token: token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      type: user.type,
    },
  });
});

// Get Logged-in User
app.get("/api/auth/user", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user) {
    return res.status(404).send("No user found.");
  }
  res.status(200).send({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    type: user.type,
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const articles = [
  {
    id: 1,
    image: "https://via.placeholder.com/150",
    title: "First Article",
    link: "https://example.com/first-article",
    date: "2023-10-22",
    content: "This is the first article content.",
    status: "For Edit",
    writer: users[0], // Writer User
    editor: null,
    company: {
      id: 1,
      logo: "https://via.placeholder.com/50",
      name: "Example Company",
      status: "Active",
    },
  },
  {
    id: 2,
    image: "https://via.placeholder.com/150",
    title: "Second Article",
    link: "https://example.com/second-article",
    date: "2023-10-21",
    content: "This is the second article content.",
    status: "Published",
    writer: users[0], // Writer User
    editor: users[1], // Editor User
    company: {
      id: 1,
      logo: "https://via.placeholder.com/50",
      name: "Example Company",
      status: "Active",
    },
  },
];

// Get All Articles
app.get("/api/articles", verifyToken, (req, res) => {
  res.status(200).send(articles);
});

// backend/index.js

// Sample Companies
const companies = [
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
    status: "Inactive",
  },
];

// Create a New Article
app.post("/api/articles", verifyToken, (req, res) => {
  const { image, title, link, date, content, companyId } = req.body;
  const writer = users.find((u) => u.id === req.userId);
  const company = companies.find((c) => c.id === companyId);
  if (!writer || !company) {
    return res.status(400).send("Invalid writer or company.");
  }

  const newArticle = {
    id: articles.length + 1,
    image,
    title,
    link,
    date,
    content,
    status: "For Edit",
    writer,
    editor: null,
    company,
  };

  articles.push(newArticle);
  res.status(201).send(newArticle);
});

// Update an Article
app.put("/api/articles/:id", verifyToken, (req, res) => {
  const articleId = parseInt(req.params.id);
  const article = articles.find((a) => a.id === articleId);
  if (!article) {
    return res.status(404).send("Article not found.");
  }

  // Only editors can publish articles
  if (req.body.status === "Published") {
    const editor = users.find((u) => u.id === req.userId);
    if (!editor || editor.type !== "Editor") {
      return res.status(403).send("Only editors can publish articles.");
    }
    article.status = "Published";
    article.editor = editor;
  } else {
    // Writers can edit their own articles if status is "For Edit"
    if (article.writer.id !== req.userId || article.status !== "For Edit") {
      return res.status(403).send("You cannot edit this article.");
    }
    const { image, title, link, date, content, companyId } = req.body;
    const company = companies.find((c) => c.id === companyId);
    if (!company) {
      return res.status(400).send("Invalid company.");
    }

    article.image = image;
    article.title = title;
    article.link = link;
    article.date = date;
    article.content = content;
    article.company = company;
  }

  res.status(200).send(article);
});

// Delete an Article
app.delete("/api/articles/:id", verifyToken, (req, res) => {
  const articleId = parseInt(req.params.id);
  const articleIndex = articles.findIndex((a) => a.id === articleId);
  if (articleIndex === -1) {
    return res.status(404).send("Article not found.");
  }

  // eslint-disable-next-line no-unused-vars
  const article = articles[articleIndex];

  // Only editors can delete articles
  const user = users.find((u) => u.id === req.userId);
  if (!user || user.type !== "Editor") {
    return res.status(403).send("Only editors can delete articles.");
  }

  articles.splice(articleIndex, 1);
  res.status(200).send({ message: "Article deleted successfully." });
});

// Get All Users (Editors Only)
app.get("/api/users", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user || user.type !== "Editor") {
    return res.status(403).send("Access denied.");
  }
  res.status(200).send(users);
});

// Create a New User (Editors Only)
app.post("/api/users", verifyToken, (req, res) => {
  const editor = users.find((u) => u.id === req.userId);
  if (!editor || editor.type !== "Editor") {
    return res.status(403).send("Only editors can create users.");
  }

  const { firstname, lastname, email, password, type, status } = req.body;
  if (!firstname || !lastname || !email || !password || !type || !status) {
    return res.status(400).send("All fields are required.");
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).send("User with this email already exists.");
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = {
    id: users.length + 1,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    type,
    status,
  };

  users.push(newUser);
  res.status(201).send(newUser);
});

// Update a User (Editors Only)
app.put("/api/users/:id", verifyToken, (req, res) => {
  const editor = users.find((u) => u.id === req.userId);
  if (!editor || editor.type !== "Editor") {
    return res.status(403).send("Only editors can update users.");
  }

  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  const { firstname, lastname, type, status } = req.body;
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (type) user.type = type;
  if (status) user.status = status;

  res.status(200).send(user);
});

// Get All Companies (Editors Only)
app.get("/api/companies", verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.userId);
  if (!user || user.type !== "Editor") {
    return res.status(403).send("Access denied.");
  }
  res.status(200).send(companies);
});

// Create a New Company (Editors Only)
app.post("/api/companies", verifyToken, (req, res) => {
  const editor = users.find((u) => u.id === req.userId);
  if (!editor || editor.type !== "Editor") {
    return res.status(403).send("Only editors can create companies.");
  }

  const { logo, name, status } = req.body;
  if (!logo || !name || !status) {
    return res.status(400).send("All fields are required.");
  }

  const existingCompany = companies.find((c) => c.name === name);
  if (existingCompany) {
    return res.status(400).send("Company with this name already exists.");
  }

  const newCompany = {
    id: companies.length + 1,
    logo,
    name,
    status,
  };

  companies.push(newCompany);
  res.status(201).send(newCompany);
});

// Update a Company (Editors Only)
app.put("/api/companies/:id", verifyToken, (req, res) => {
  const editor = users.find((u) => u.id === req.userId);
  if (!editor || editor.type !== "Editor") {
    return res.status(403).send("Only editors can update companies.");
  }

  const companyId = parseInt(req.params.id);
  const company = companies.find((c) => c.id === companyId);
  if (!company) {
    return res.status(404).send("Company not found.");
  }

  const { logo, name, status } = req.body;
  if (logo) company.logo = logo;
  if (name) company.name = name;
  if (status) company.status = status;

  res.status(200).send(company);
});
