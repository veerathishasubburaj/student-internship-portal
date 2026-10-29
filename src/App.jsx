
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import internships from "./data/internships";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed.");
  }

  return data;
}

function getApplications(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.applications)) return data.applications;
  return [];
}

function Navigation() {
  return (
    <header className="app-header">
      <Link to="/" className="brand">
        InternPortal
      </Link>

      <nav className="main-nav">
        <Link to="/">Dashboard</Link>
        <Link to="/internships">Internships</Link>
        <Link to="/apply">Apply</Link>
        <Link to="/applications">Applications</Link>
      </nav>
    </header>
  );
}

function Dashboard() {
  return (
    <main className="page-container">
      <section className="hero-section">
        <p className="eyebrow">STUDENT INTERNSHIP PORTAL</p>
        <h1>Start Your Career Journey</h1>
        <p>
          Discover internship opportunities, explore the details, and submit
          your application through one simple portal.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" to="/internships">
            Explore Internships
          </Link>
          <Link className="secondary-button" to="/apply">
            Apply Now
          </Link>
        </div>
      </section>

      <section className="section-block">
        <h2>Explore Opportunities</h2>
        <p>Choose an internship that matches your interests and skills.</p>

        <div className="internship-grid">
          {internships.slice(0, 3).map((internship) => (
            <article className="internship-card" key={internship.id}>
              <h3>{internship.title}</h3>
              <p>{internship.company}</p>
              <p>
                {internship.duration} · {internship.location}
              </p>
              <Link to={`/internships/${internship.id}`}>
                View Details →
              </Link>
            </article>
          ))}
        </div>

        <Link to="/internships">View all internships →</Link>
      </section>
    </main>
  );
}

function InternshipList() {
  return (
    <main className="page-container">
      <section className="section-block">
        <h1>Available Internships</h1>
        <p>Explore the available opportunities and their requirements.</p>

        <div className="internship-grid">
          {internships.map((internship) => (
            <article className="internship-card" key={internship.id}>
              <h2>{internship.title}</h2>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Duration:</strong> {internship.duration}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <p><strong>Type:</strong> {internship.type}</p>

              <div className="skill-list">
                {internship.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>

              <Link
                className="primary-button"
                to={`/internships/${internship.id}`}
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const internship = internships.find((item) => item.id === id);

  if (!internship) {
    return (
      <main className="page-container">
        <h1>Internship Not Found</h1>
        <p>The internship you requested does not exist.</p>
        <Link to="/internships">Back to Internships</Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <article className="detail-card">
        <Link to="/internships">← Back to Internships</Link>

        <h1>{internship.title}</h1>
        <h2>{internship.company}</h2>

        <p><strong>Duration:</strong> {internship.duration}</p>
        <p><strong>Location:</strong> {internship.location}</p>
        <p><strong>Type:</strong> {internship.type}</p>

        <h3>About this Internship</h3>
        <p>{internship.description}</p>

        <h3>Required Skills</h3>
        <div className="skill-list">
          {internship.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <Link
          className="primary-button"
          to={`/apply?internship=${encodeURIComponent(internship.id)}`}
        >
          Apply Now
        </Link>
      </article>
    </main>
  );
}

function ApplicationForm() {
  const [searchParams] = useSearchParams();

  const initialInternship = searchParams.get("internship") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    internship: internships.some(
      (item) => item.id === initialInternship
    )
      ? initialInternship
      : "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const name = form.name.trim();
    const email = form.email.trim();
    const rollNumber = form.rollNumber.trim();
    const selectedInternship = internships.find(
      (item) => item.id === form.internship
    );

    if (!name || !email || !rollNumber || !selectedInternship) {
      setMessage("Please complete all fields and select a valid internship.");
      setMessageType("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          rollNumber,
          internship: selectedInternship.title,
        }),
      });

      setMessage("Application submitted successfully!");
      setMessageType("success");

      setForm({
        name: "",
        email: "",
        rollNumber: "",
        internship: "",
      });
    } catch (error) {
      setMessage(
        `${error.message} Check that the backend is running and the API URL is correct.`
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-container">
      <section className="form-card">
        <h1>Internship Application</h1>
        <p>Enter your details and select the internship you want to apply for.</p>

        {message && (
          <div
            className={`status-message ${messageType}`}
            role="status"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            maxLength={100}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
          />

          <label htmlFor="rollNumber">Roll Number</label>
          <input
            id="rollNumber"
            name="rollNumber"
            type="text"
            value={form.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
            maxLength={50}
            required
          />

          <label htmlFor="internship">Select Internship</label>
          <select
            id="internship"
            name="internship"
            value={form.internship}
            onChange={handleChange}
            required
          >
            <option value="">Choose an internship</option>
            {internships.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} — {item.company}
              </option>
            ))}
          </select>

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>
    </main>
  );
}

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    internship: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadApplications() {
    setLoading(true);
    setMessage("");

    try {
      const data = await apiRequest("/api/applications");
      setApplications(getApplications(data));
    } catch (error) {
      setMessage(error.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function startEditing(application) {
    setEditingId(application._id);
    setEditForm({
      name: application.name || "",
      email: application.email || "",
      rollNumber: application.rollNumber || "",
      internship: application.internship || "",
    });
    setMessage("");
  }

  async function saveEdit(event) {
    event.preventDefault();

    if (!editForm.name.trim() || !editForm.rollNumber.trim()) {
      setMessage("Name and roll number are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updated = await apiRequest(
        `/api/applications/${editingId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            rollNumber: editForm.rollNumber.trim(),
            internship: editForm.internship.trim(),
          }),
        }
      );

      const updatedApplication = updated.application || updated;

      setApplications((previous) =>
        previous.map((item) =>
          item._id === editingId
            ? { ...item, ...updatedApplication }
            : item
        )
      );

      setEditingId(null);
      setMessage("Application updated successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to update application.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteApplication(id) {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      await apiRequest(`/api/applications/${id}`, {
        method: "DELETE",
      });

      setApplications((previous) =>
        previous.filter((item) => item._id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
      }

      setMessage("Application deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete application.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredApplications = applications.filter((application) => {
    const searchableText = [
      application.name,
      application.email,
      application.rollNumber,
      application.internship,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search.toLowerCase());
  });

  return (
    <main className="page-container">
      <section className="section-block">
        <h1>Submitted Applications</h1>
        <p>View, search, edit, or delete submitted applications.</p>

        {message && (
          <div className="status-message" role="status">
            {message}
          </div>
        )}

        <div className="applications-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, roll number, or internship"
            aria-label="Search applications"
          />

          <button
            type="button"
            className="secondary-button"
            onClick={loadApplications}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p>Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="application-list">
            {filteredApplications.map((application) => (
              <article className="application-card" key={application._id}>
                {editingId === application._id ? (
                  <form onSubmit={saveEdit}>
                    <h2>Edit Application</h2>

                    <label htmlFor={`edit-name-${application._id}`}>
                      Full Name
                    </label>
                    <input
                      id={`edit-name-${application._id}`}
                      value={editForm.name}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          name: event.target.value,
                        })
                      }
                      required
                    />

                    <label htmlFor={`edit-email-${application._id}`}>
                      Email
                    </label>
                    <input
                      id={`edit-email-${application._id}`}
                      type="email"
                      value={editForm.email}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          email: event.target.value,
                        })
                      }
                      required
                    />

                    <label htmlFor={`edit-roll-${application._id}`}>
                      Roll Number
                    </label>
                    <input
                      id={`edit-roll-${application._id}`}
                      value={editForm.rollNumber}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          rollNumber: event.target.value,
                        })
                      }
                      required
                    />

                    <label htmlFor={`edit-internship-${application._id}`}>
                      Internship
                    </label>
                    <input
                      id={`edit-internship-${application._id}`}
                      value={editForm.internship}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          internship: event.target.value,
                        })
                      }
                      required
                    />

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setEditingId(null)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h2>{application.name}</h2>
                    <p><strong>Email:</strong> {application.email}</p>
                    <p>
                      <strong>Roll Number:</strong> {application.rollNumber}
                    </p>
                    <p>
                      <strong>Internship:</strong> {application.internship}
                    </p>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => startEditing(application)}
                        disabled={Boolean(deletingId)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => deleteApplication(application._id)}
                        disabled={Boolean(deletingId)}
                      >
                        {deletingId === application._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function NotFound() {
  return (
    <main className="page-container">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to Dashboard</Link>
    </main>
  );
}

function AppLayout() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/internships" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="app-footer">
        <p>Student Internship Portal · Learning and career opportunities</p>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
