import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <Title level={2}>404 - Page Not Found</Title>
      <Paragraph>Oops! The page you are looking for does not exist.</Paragraph>
      <Button type="primary" onClick={() => navigate("/login")}>
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;
