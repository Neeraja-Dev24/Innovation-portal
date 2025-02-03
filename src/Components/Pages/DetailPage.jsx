import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IdeasData } from "../../Data/IdeasData";
import { Layout, Card, Image, Typography, Button, Divider } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./DetailPage.css";
import HeaderNav from "../Header/HeaderNav";

const { Title, Text } = Typography;
const { Content } = Layout;

const DetailPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    const foundIdea = IdeasData.find((idea) => idea.key === key);
    setIdea(foundIdea);
  }, [key]);

  if (!idea) return <Text>Loading...</Text>;

  return (
    <Layout>
      <HeaderNav />
      <Content className="detail-content">
        <Card className="detail-card">
          {/* Back Button */}
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Back
          </Button>

          <div className="detail-container">
            <div className="user-info-container">
              <Image
                width={100}
                height={100}
                src="https://www.venmond.com/demo/vendroid/img/avatar/big.jpg"
                alt="User"
                className="user-image"
              />
              <div className="user-info">
                <h1>{idea.username}</h1>
                <h2 className="status">
                  <strong>Status: </strong>
                  {idea.status === "Approved" ? (
                    <span className="approved">
                      <CheckCircleOutlined /> Approved
                    </span>
                  ) : (
                    <span className="rejected">
                      <CloseCircleOutlined /> Rejected
                    </span>
                  )}
                </h2>
                <h2 className="accepted-count">
                  <strong>Accepted Count:</strong> {idea.acceptedCount || 0}
                </h2>
              </div>
            </div>

            <div className="idea-details-container">
              <Title level={2}>{idea.title}</Title>
              <Text className="category">
                <strong>Category:</strong> {idea.category}
              </Text>
              <Divider />
              <Text className="idea-description">{idea.description}</Text>
              <Divider />

              {/* File View */}
              {idea.fileType === "image" ? (
                <Image
                  src={idea.fileUrl}
                  alt="Idea Image"
                  className="idea-image"
                />
              ) : (
                <Button type="link" href={idea.fileUrl} target="_blank">
                  View PDF
                </Button>
              )}
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default DetailPage;
