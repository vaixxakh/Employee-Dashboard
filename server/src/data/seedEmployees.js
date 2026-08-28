require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const EMPLOYEES = [
  { name: "Aaron George", email: "aaron.george@techtemple.com", department: "Frontend", salary: 62000, status: "Active", phone: "9000000001", location: "Thiruvananthapuram", startDate: "2025-07-01" },
  { name: "Bhavna Iyer", email: "bhavna.iyer@techtemple.com", department: "Backend", salary: 74000, status: "Active", phone: "9000000002", location: "Kochi", startDate: "2025-07-15" },
  { name: "Chetan Desai", email: "chetan.desai@techtemple.com", department: "Full Stack", salary: 82000, status: "Active", phone: "9000000003", location: "Ernakulam", startDate: "2025-08-01" },
  { name: "Divya Pillai", email: "divya.pillai@techtemple.com", department: "QA", salary: 38000, status: "Active", phone: "9000000004", location: "Kottayam", startDate: "2025-08-10" },
  { name: "Eesha Sharma", email: "eesha.sharma@techtemple.com", department: "HR", salary: 45000, status: "Active", phone: "9000000005", location: "Kozhikode", startDate: "2025-08-20" },
  { name: "Farhan Khan", email: "farhan.khan@techtemple.com", department: "Backend", salary: 70000, status: "Active", phone: "9000000006", location: "Kochi", startDate: "2025-09-01" },
  { name: "Ganesh Nambiar", email: "ganesh.nambiar@techtemple.com", department: "UI/UX", salary: 58000, status: "Active", phone: "9000000007", location: "Thrissur", startDate: "2025-09-12" },
  { name: "Hema Krishnamurthy", email: "hema.krishnamurthy@techtemple.com", department: "Testing", salary: 49000, status: "Active", phone: "9000000008", location: "Kannur", startDate: "2025-09-25" },
  { name: "Imran Shaikh", email: "imran.shaikh@techtemple.com", department: "Full Stack", salary: 88000, status: "Active", phone: "9000000009", location: "Ernakulam", startDate: "2025-10-05" },
  { name: "Jaya Lakshmi", email: "jaya.lakshmi@techtemple.com", department: "Frontend", salary: 64000, status: "Active", phone: "9000000010", location: "Alappuzha", startDate: "2025-10-15" },
  { name: "Karthik Varma", email: "karthik.varma@techtemple.com", department: "Backend", salary: 76000, status: "Active", phone: "9000000011", location: "Kollam", startDate: "2025-10-28" },
  { name: "Leela Menon", email: "leela.menon@techtemple.com", department: "HR", salary: 42000, status: "Active", phone: "9000000012", location: "Palakkad", startDate: "2025-11-10" },
  { name: "Manoj Kuttan", email: "manoj.kuttan@techtemple.com", department: "QA", salary: 36000, status: "Inactive", phone: "9000000013", location: "Malappuram", startDate: "2025-11-20" },
  { name: "Nikhil Mathew", email: "nikhil.mathew@techtemple.com", department: "Testing", salary: 51000, status: "Active", phone: "9000000014", location: "Idukki", startDate: "2025-12-01" },
  { name: "Ojaswi Reddy", email: "ojaswi.reddy@techtemple.com", department: "UI/UX", salary: 54000, status: "Active", phone: "9000000015", location: "Wayanad", startDate: "2025-12-10" },
  { name: "Priya Venugopal", email: "priya.venugopal@techtemple.com", department: "Frontend", salary: 67000, status: "Active", phone: "9000000016", location: "Thiruvananthapuram", startDate: "2026-01-05" },
  { name: "Ravi Nair", email: "ravi.nair@techtemple.com", department: "Backend", salary: 79000, status: "Active", phone: "9000000017", location: "Kochi", startDate: "2026-01-18" },
  { name: "Sana Qureshi", email: "sana.qureshi@techtemple.com", department: "HR", salary: 44000, status: "Inactive", phone: "9000000018", location: "Kozhikode", startDate: "2026-01-28" },
  { name: "Tejas Patil", email: "tejas.patil@techtemple.com", department: "Full Stack", salary: 85000, status: "Active", phone: "9000000019", location: "Ernakulam", startDate: "2026-02-08" },
  { name: "Uma Sankar", email: "uma.sankar@techtemple.com", department: "QA", salary: 39000, status: "Active", phone: "9000000020", location: "Kottayam", startDate: "2026-02-16" },
  { name: "Vikram Shetty", email: "vikram.shetty@techtemple.com", department: "Backend", salary: 73000, status: "Active", phone: "9000000021", location: "Thrissur", startDate: "2026-02-24" },
  { name: "Waseem Ahmed", email: "waseem.ahmed@techtemple.com", department: "Testing", salary: 48000, status: "Inactive", phone: "9000000022", location: "Malappuram", startDate: "2026-03-03" },
  { name: "Xavier Mathew", email: "xavier.mathew@techtemple.com", department: "Frontend", salary: 61000, status: "Active", phone: "9000000023", location: "Kollam", startDate: "2026-03-12" },
  { name: "Yashika Rao", email: "yashika.rao@techtemple.com", department: "UI/UX", salary: 56000, status: "Active", phone: "9000000024", location: "Kannur", startDate: "2026-03-20" },
  { name: "Zoya Mirza", email: "zoya.mirza@techtemple.com", department: "Full Stack", salary: 90000, status: "Active", phone: "9000000025", location: "Alappuzha", startDate: "2026-03-28" },
];

async function seedEmployees() {
  try {
    await mongoose.connect(process.env.MONGODBURI);

    console.log("Connected to MongoDB.");

    const existingEmails = await Employee.distinct("email");

    const existingSet = new Set(
      existingEmails.map((email) => String(email).toLowerCase().trim())
    );

    const normalized = EMPLOYEES.map((employee) => ({
      ...employee,
      email: employee.email.toLowerCase().trim(),
    }));

    const uniqueEmails = new Set(normalized.map((employee) => employee.email));

    if (uniqueEmails.size !== normalized.length) {
      throw new Error("Seed data contains duplicate email addresses.");
    }

    const newEmployees = normalized.filter(
      (employee) => !existingSet.has(employee.email)
    );

    if (newEmployees.length === 0) {
      const total = await Employee.countDocuments({});

      console.log(
        `All ${EMPLOYEES.length} sample emails already exist. Nothing inserted.`
      );
      console.log(`Total employees in database: ${total}`);

      await mongoose.connection.close();
      process.exit(0);
    }

    const inserted = await Employee.insertMany(newEmployees, { ordered: false });

    console.log(`Inserted ${inserted.length} new sample employees.`);

    const total = await Employee.countDocuments({});

    console.log(`Total employees in database: ${total}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding employees:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

seedEmployees();