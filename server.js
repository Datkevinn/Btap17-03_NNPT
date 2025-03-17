const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "categories.json";

app.use(cors());
app.use(express.json());

// Đọc dữ liệu từ file JSON
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Ghi dữ liệu vào file JSON
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API GET - Lấy danh sách category
app.get("/categories", (req, res) => {
  res.json(readData());
});

// API POST - Thêm category
app.post("/categories", (req, res) => {
  const categories = readData();
  const newCategory = { id: Date.now(), name: req.body.name };
  categories.push(newCategory);
  writeData(categories);
  res.json(newCategory);
});

// API PUT - Cập nhật category
app.put("/categories/:id", (req, res) => {
  let categories = readData();
  categories = categories.map((cat) =>
    cat.id == req.params.id ? { ...cat, name: req.body.name } : cat
  );
  writeData(categories);
  res.json({ message: "Category updated!" });
});

// API DELETE - Xóa category
app.delete("/categories/:id", (req, res) => {
  let categories = readData();
  categories = categories.filter((cat) => cat.id != req.params.id);
  writeData(categories);
  res.json({ message: "Category deleted!" });
});

// Chạy server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Welcome to Category API!");
});
