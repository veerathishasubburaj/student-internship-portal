
import { Link } from "react-router-dom";
import internships from "../data/internships";

function InternshipList() {
  return (
    <main className="internship-page">
      <div className="internship-heading">
        <h1>Available Internships</h1>
        <p>Explore internship opportunities and find one that matches your skills.</p>
      </div>

      <div className="internship-grid">
        {internships.map((internship) => (
          <article className="internship-card" key={internship.id}>
            <h2>{internship.title}</h2>
            <p><strong>Company:</strong> {internship.company}</p>
            <p><strong>Duration:</strong> {internship.duration}</p>
            <p><strong>Location:</strong> {internship.location}</p>

            <div className="internship-skills">
              {internship.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <Link
              className="internship-button"
              to={`/internships/${internship.id}`}
            >
              View Details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

export default InternshipList;
