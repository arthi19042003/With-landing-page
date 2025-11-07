const Candidate = require("../models/Candidate");
const Position = require("../models/Position");
const Submission = require("../models/Submission");
const Message = require("../models/Message");
const PurchaseOrder = require("../models/PurchaseOrder");
const Interview = require("../models/Interview");
const Onboarding = require("../models/Onboarding");
const User = require("../models/User");

module.exports = async function seedDatabase() {
  try {
    console.log("🧹 Clearing old sample data...");
    await Promise.all([
      User.deleteMany({}),
      Candidate.deleteMany({}),
      Position.deleteMany({}),
      Submission.deleteMany({}),
      Message.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      Interview.deleteMany({}),
      Onboarding.deleteMany({}),
    ]);

    console.log("🌱 Inserting fresh sample data...");

    // --- Sample Users ---
    const seedUser = await User.create({
      name: "Seed User",
      email: "seed@example.com",
      password: "password123",
      role: "manager",
    });

    const recruiterUser = await User.create({
      name: "Recruiter User",
      email: "recruiter@example.com",
      password: "password123",
      role: "manager",
    });

    console.log(`✅ Users created: ${seedUser.email}, ${recruiterUser.email}`);

    // --- Sample Positions ---
    const positions = await Position.insertMany([
      {
        title: "Frontend Developer",
        department: "Engineering",
        project: "Website Revamp",
        status: "open",
      },
      {
        title: "Backend Developer",
        department: "Engineering",
        project: "API Development",
        status: "open",
      },
      {
        title: "Project Manager",
        department: "Operations",
        project: "HRMS Upgrade",
        status: "open",
      },
    ]);
    console.log(`✅ Positions created: ${positions.length}`);

    // --- Sample Candidates ---
    const candidates = await Candidate.insertMany([
      {
        firstName: "Sasi",
        lastName: "Kumar",
        email: "sasi@example.com",
        phone: "9876543210",
        position: positions[0].title,
        status: "Submitted",
      },
      {
        firstName: "Anita",
        lastName: "Reddy",
        email: "anita@example.com",
        phone: "9123456780",
        position: positions[1].title,
        status: "Shortlisted",
      },
      {
        firstName: "Ravi",
        lastName: "Patel",
        email: "ravi@example.com",
        phone: "9988776655",
        position: positions[2].title,
        status: "Hired",
      },
    ]);
    console.log(`✅ Candidates created: ${candidates.length}`);

    // --- Sample Submissions ---
    await Submission.insertMany([
      {
        candidate: candidates[0]._id,
        position: positions[0]._id,
        status: "submitted",
        submittedBy: seedUser._id,
      },
      {
        candidate: candidates[1]._id,
        position: positions[1]._id,
        status: "reviewed",
        submittedBy: seedUser._id,
      },
      {
        candidate: candidates[2]._id,
        position: positions[2]._id,
        status: "hired",
        submittedBy: seedUser._id,
      },
    ]);
    console.log("✅ Submissions created: 3");

    // --- Sample Messages ---
    await Message.insertMany([
      // Messages for Seed User
      {
        subject: "Interview Scheduled (DB)",
        message: "Interview set for tomorrow with Seed User.",
        from: "hr@example.com",
        to: seedUser.email,
        status: "unread",
        createdAt: new Date("2025-10-29T10:00:00Z"),
      },
      {
        subject: "Reminder (DB)",
        message: "Please confirm your slot for the upcoming meeting.",
        from: "hr@example.com",
        to: seedUser.email,
        status: "read",
        createdAt: new Date("2025-10-28T14:30:00Z"),
      },
      {
        subject: "Welcome Aboard! (DB)",
        message: "Details about your first day.",
        from: "onboarding@example.com",
        to: seedUser.email,
        status: "unread",
        createdAt: new Date("2025-10-27T09:15:00Z"),
      },

      // Messages for Recruiter User
      {
        subject: "New Candidate Submission",
        message: "A new candidate has applied for the Backend Developer position.",
        from: "hr@example.com",
        to: recruiterUser.email,
        status: "unread",
        createdAt: new Date("2025-10-26T09:30:00Z"),
      },
      {
        subject: "Weekly Hiring Report",
        message: "Here’s your hiring activity summary for the week.",
        from: "system@example.com",
        to: recruiterUser.email,
        status: "read",
        createdAt: new Date("2025-10-25T12:45:00Z"),
      },
    ]);
    console.log(`✅ Messages created for: ${seedUser.email} and ${recruiterUser.email}`);

    // --- Sample Purchase Orders ---
    await PurchaseOrder.insertMany([
      {
        poId: 101,
        vendor: "Tech Supplies Ltd",
        amount: 50000,
        date: "2025-10-10",
        status: "Approved",
      },
      {
        poId: 102,
        vendor: "Office Depot",
        amount: 30000,
        date: "2025-10-11",
        status: "Pending",
      },
    ]);
    console.log("✅ Purchase Orders created: 2");

    // --- Sample Interviews ---
    await Interview.insertMany([
      {
        candidate: candidates[0]._id,
        position: positions[0]._id,
        date: new Date(),
        type: "Technical",
        status: "completed",
      },
      {
        candidate: candidates[1]._id,
        position: positions[1]._id,
        date: new Date(),
        type: "HR",
        status: "scheduled",
      },
    ]);
    console.log("✅ Interviews created: 2");

    // --- Sample Onboarding ---
    await Onboarding.insertMany([
      {
        candidate: candidates[0]._id,
        startDate: new Date("2025-11-15"),
        documentsCompleted: true,
        status: "Completed",
      },
      {
        candidate: candidates[1]._id,
        startDate: new Date("2025-12-01"),
        documentsCompleted: false,
        status: "Initiated",
      },
    ]);
    console.log("✅ Onboarding records created: 2");

    console.log("🎉 Database seeded successfully with multi-user data");
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
  }
};
