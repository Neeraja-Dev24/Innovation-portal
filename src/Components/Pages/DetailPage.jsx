import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Row, Col, Typography, Divider, Spin, Table } from "antd";

const { Title, Text } = Typography;

const DetailPage = () => {
  const { ideaId } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`http://localhost:5001/ideasdata/${ideaId}`)
      .then((response) => response.json())
      .then((data) => {
        setIdea(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching idea details:", error);
        setLoading(false);
      });
  }, [ideaId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!idea) {
    return <Text type="danger">Idea not found</Text>;
  }

  const reviewerColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text) => text || "No comments yet",
    },
    {
      title: "Approved Date",
      dataIndex: "approvedDate",
      key: "approvedDate",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card>
        {/* User Information */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>User Information</Title>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Name: </Text>
            <Text>{idea.username}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Email: </Text>
            <Text>{idea.email}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Published Date: </Text>
            <Text>{idea.publishedDate}</Text>
          </Col>
        </Row>
        
        <Divider />
        
        {/* Reviewer Information */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Reviewer Information</Title>
          </Col>
          <Col span={24} className="table-responsive">
            <Table 
              columns={reviewerColumns} 
              dataSource={idea.reviewerDetails || []} 
              rowKey={(record, index) => index} 
              pagination={false} 
              className="custom-table"
            />
          </Col>
        </Row>
        
        <Divider />
        
        {/* Innovation Details */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Innovation Details</Title>
          </Col>
          <Col xs={24}>
            <Text strong>Title: </Text>
            <Text>{idea.title}</Text>
          </Col>
          <Col xs={24}>
            <Text strong>Description: </Text>
            <div className="idea-description" dangerouslySetInnerHTML={{ __html: idea.description }} />
          </Col>
          <Col xs={24}>
            <Text strong>Category: </Text>
            <Text>{idea.category}</Text>
          </Col>
          <Col xs={24}>
            <Text strong>Attachments: </Text>
            {idea.files && idea.files.length > 0 ? (
              <div className="attachments-container">
                {idea.files.map((file, index) => (
                  <div key={index} className="attachment-item">
                    {file.type && file.type.startsWith("image") ? (
                      // For images (including GIFs)
                      <img
                        src={file.url}
                        alt={file.name || "Uploaded Image"}
                        className="uploaded-image"
                      />
                    ) : file.type && file.type.includes("pdf") ? (
                      // For PDFs, embed using an <object>
                      <object
                        data={file.url}
                        type="application/pdf"
                        width="100%"
                        height="400px"
                      >
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name ? file.name : "View File"}
                        </a>
                      </object>
                    ) : (
                      // For other file types (e.g., zip, doc), display a download/view link
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.name ? file.name : "Download File"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Text>No attachments</Text>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DetailPage;
