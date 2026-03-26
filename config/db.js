const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/eventsDB");
        console.log("MongoDB Connected ✅");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
db.events.insertMany([
  { title: "Tech Fest 2024", type: "Fest", date: "Dec 15", location: "Delhi", description: "Biggest tech fest!" },
  { title: "Code Wars", type: "Hackathon", date: "Dec 20", location: "Mumbai", description: "24 hour coding" },
  { title: "AI Summit", type: "AI Workshop", date: "Dec 25", location: "Bangalore", description: "Learn AI" }
])

module.exports = connectDB;