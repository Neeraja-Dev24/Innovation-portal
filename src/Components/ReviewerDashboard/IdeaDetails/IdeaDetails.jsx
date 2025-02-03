import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IdeasData } from "../../../Data/IdeasData";
import { Layout, Typography, Button, Card, Image} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useUser } from "../../../UserContext/UserContext";
import "./IdeaDetails.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const IdeaDetails = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useUser();
  const [idea, setIdea] = useState(null);
  const [status, setStatus] = useState("");


  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "reviewer") {
      navigate("/");
    }

    const foundIdea = IdeasData.find((idea) => idea.key === key);
    if (foundIdea) {
      setIdea(foundIdea);
      setStatus(foundIdea.status);
    }
  }, [key, loggedInUser, navigate]);



  return (
    <Layout className="layout-container">
      {/* Header */}
      <Header className="site-header">
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate("/reviewer-dashboard")}>
          Back to Pending Ideas
        </Button>
      </Header>

      <Layout style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sider width={240} className="sidebar" theme="dark"></Sider>

        {/* Main Content */}
        <Layout className="layout-content">
          <Content className="content-wrapper">
            {idea ? (
              <Card className="details-card">
                <h1 className="idea-category"><strong>{idea.title}</strong></h1>
                <Text className="idea-category"><strong>Category:</strong> {idea.category}</Text>
                <Text className="idea-description">Summary :{idea.description}</Text>

                {/* User Information */}
                <Card className="user-card">
                  <Title level={4}>Submitted by: {idea.username}</Title>
                  <Text><strong>Status:</strong> {status}</Text>
                  
                  {/* File Preview */}
                  {idea.fileType === "image" ? (
                    <Image className="idea-image" src={idea.fileUrl} alt="Idea Image" />
                  ) : (
                    <Button type="link" href={idea.fileUrl} target="_blank">
                      View PDF
                    </Button>
                  )}
                </Card>

               
              </Card>
            ) : (
              <Text>Loading...</Text>
            )}
          </Content>
        </Layout>
      </Layout>

     
    </Layout>
  );
};

export default IdeaDetails;
