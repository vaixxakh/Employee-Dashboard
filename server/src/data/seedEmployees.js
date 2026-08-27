require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const employees = [
  {
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    department: "Backend",
    salary: 45000,
    status: "Active",
    phone: "9876543210",
    location: "Kochi",
    startDate: "2026-01-10",
  },
  {
    name: "Anjali Nair",
    email: "anjali.nair@gmail.com",
    department: "Frontend",
    salary: 52000,
    status: "Active",
    phone: "9876543211",
    location: "Calicut",
    startDate: "2026-01-15",
  },
  {
    name: "Arjun Menon",
    email: "arjun.menon@example.com",
    department: "Backend",
    salary: 68000,
    status: "Active",
    phone: "9876543212",
    location: "Kochi",
    startDate: "2026-02-01",
  },
  {
    name: "Meera Thomas",
    email: "meera.thomas@example.com",
    department: "HR",
    salary: 35000,
    status: "Inactive",
    phone: "9876543213",
    location: "Thrissur",
    startDate: "2026-02-05",
  },
  {
    name: "Vishnu Raj",
    email: "vishnu.raj@example.com",
    department: "Frontend",
    salary: 60000,
    status: "Active",
    phone: "9876543214",
    location: "Kochi",
    startDate: "2026-02-12",
  },
  {
    name: "Sneha Paul",
    email: "sneha.paul@example.com",
    department: "QA",
    salary: 30000,
    status: "Inactive",
    phone: "9876543215",
    location: "Kannur",
    startDate: "2026-02-20",
  },
  {
    name: "Adithya Krishnan",
    email: "adithya.krishnan@example.com",
    department: "Backend",
    salary: 80000,
    status: "Active",
    phone: "9876543216",
    location: "Kochi",
    startDate: "2026-03-01",
  },
  {
    name: "Neha Joseph",
    email: "neha.joseph@example.com",
    department: "HR",
    salary: 40000,
    status: "Active",
    phone: "9876543217",
    location: "Kottayam",
    startDate: "2026-03-10",
  },
  {
    name: "Fahad Ali",
    email: "fahad.ali@example.com",
    department: "QA",
    salary: 25000,
    status: "Inactive",
    phone: "9876543218",
    location: "Malappuram",
    startDate: "2026-03-15",
  },
  {
    name: "Devika Suresh",
    email: "devika.suresh@example.com",
    department: "Frontend",
    salary: 55000,
    status: "Active",
    phone: "9876543219",
    location: "Ernakulam",
    startDate: "2026-04-01",
  },
];

async function seedEmployees() {
  try {
    await mongoose.connect(process.env.MONGODBURI);

    await Employee.deleteMany({});

    await Employee.insertMany(employees);

    console.log(`${employees.length} employees seeded successfully.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding employees:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
}

seedEmployees();