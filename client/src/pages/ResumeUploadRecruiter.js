import React, { useState } from "react";
import "./ResumeUploadRecruiter.css";
import api from "../config";

const ResumeUploadRecruiter = () => {
  const formFields = {
    candidateName: { label: "Candidate Name*", type: "text", placeholder: "Enter candidate name" },
    email: { label: "Email*", type: "email", placeholder: "Enter candidate email" },
    phone: { label: "Phone*", type: "tel", placeholder: "Enter phone number" },
    skypeId: { label: "Skype ID (Optional)", type: "text", placeholder: "Enter Skype ID" },
    rate: { label: "Desired Rate ($/hr)*", type: "number", placeholder: "Enter rate in $/hr" },
    location: { label: "Location (City, State)*", type: "text", placeholder: "Enter location" },
    availability: { label: "Availability (e.g., Immediate)*", type: "text", placeholder: "Enter availability" },
    github: { label: "GitHub URL (Optional)", type: "url", placeholder: "Enter GitHub profile URL" },
    linkedin: { label: "LinkedIn URL (Optional)", type: "url", placeholder: "Enter LinkedIn profile URL" },
    hiringManager: { label: "Hiring Manager*", type: "text", placeholder: "Enter hiring manager name" },
    company: { label: "Company Name*", type: "text", placeholder: "Enter company name" },
  };

  const requiredFields = [
    "candidateName",
    "email",
    "phone",
    "rate",
    "location",
    "availability",
    "hiringManager",
    "company",
  ];

  const initialForm = Object.keys(formFields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Validation ---
  const validateField = (name, value) => {
    let error = "";
    const trimmedValue = value.trim();

    if (requiredFields.includes(name) && !trimmedValue)
      error = "This field is required";

    if (trimmedValue) {
      switch (name) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue))
            error = "Enter a valid email";
          break;
        case "phone":
          if (!/^\+\d+(?:\s?\d+)*$/.test(trimmedValue))
            error =
              "Phone number must start with +, followed by country code and digits (spaces allowed)";
          break;

        case "rate":
          if (!/^[0-9]{1,5}$/.test(trimmedValue))
            error = "Enter a valid rate (up to 5 digits)";
          break;
        default:
          break;
      }
    }

    return error;
  };

  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // --- Handle submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newErrors = {};

    Object.entries(form).forEach(([key, val]) => {
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    });
    if (!file) newErrors.file = "Please upload a resume file";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage("❌ Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("resume", file);

      await api.post("/resume/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Resume submitted successfully!");
      setForm(initialForm);
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error submitting resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-page">
      <div className="resume-upload-card">
        <h2 className="resume-upload-title">Submit Candidate Resume</h2>

        <form onSubmit={handleSubmit} className="resume-upload-form" noValidate>
          {Object.entries(formFields).map(([key, field]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{field.label}</label>
              <input
                id={key}
                type={field.type}
                name={key}
                placeholder={field.placeholder}
                value={form[key]}
                onChange={handleChange}
                className={errors[key] ? "error" : ""}
              />
              {errors[key] && (
                <span className="error-text">{errors[key]}</span>
              )}
            </div>
          ))}

          <div className="form-group file-upload">
            <label className="file-label" htmlFor="resume">
              📎 Upload Resume (PDF)*
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {errors.file && <span className="error-text">{errors.file}</span>}
          </div>
          
          {message && (
          <p
            className={`resume-upload-message ${message.startsWith("✅") ? "success-text" : "error-text"
              }`}
          >
            {message}
          </p>
        )}

          <button type="submit" className="resume-upload-btn" disabled={loading}>
            {loading ? "Submitting..." : "Send Resume"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploadRecruiter;
