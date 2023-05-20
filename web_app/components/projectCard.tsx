import { StaticImageData } from "next/image";
import { Col } from "react-bootstrap";

interface ProjectCardProps {
  title: string;
  description: string;
  imgUrl: string | StaticImageData;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imgUrl }) => {
  const imageUrl = typeof imgUrl === "string" ? imgUrl : imgUrl.toString();

  return (
    <Col xs={12} sm={6} md={4}>
      <div className="proj-imgbx">
        <img src={imageUrl} alt="Project Image" />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
        </div>
      </div>
    </Col>
  );
};
