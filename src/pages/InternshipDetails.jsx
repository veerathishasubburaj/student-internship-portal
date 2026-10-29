
import { Link, useParams } from "react-router-dom";
import internships from "../data/internships";

function InternshipDetails() {
  const { id } = useParams();

  const internship = internships.find((item) => item.id === id);

  if (!internship) {
    return (
      <main className="internship-page">
        <h1>Internship Not Found</h1>
        <Link to="/internships">Back to Internships</Link>
      </main>
    );
  }

  return (
    <main className="internship-page">
      <article className="internship-detail-card">
        <Link to="/internships">← Back to Internships</Link>

        <h1>{internship.title}</h1>
        <h2>{internship.company}</h2>

        <p><strong>Duration:</strong> {internship.duration}</p>
        <p><strong>Location:</strong> {internship.location}</p>
        <p><strong>Type:</strong> {internship.type}</p>

        <h3>About this internship</h3>
        <p>{internship.description}</p>

        <h3>Required Skills</h3>
        <ul>
          {internship.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <Link
          className="internship-button"
          to={`/apply?internship=${internship.id}`}
        >
          Apply Now
        </Link>
      </article>
    </main>
  );
}

export default InternshipDetails;
