import { useEffect, useState } from "react";
import { Table, Button, Typography, Modal, Card, Layout, Menu, message, Input, Tag } from "antd";
import { EyeOutlined, LogoutOutlined, AppstoreOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IdeasData } from "../../Data/IdeasData";
import { useUser } from "../../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import "./ReviewerDashboard.css";

const { Title } = Typography;
const { TextArea } = Input;
const { Content, Header, Sider } = Layout;

function ReviewerDashboard() {
  const [ideas, setIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "accept" or "reject"
  const [comment, setComment] = useState("");
  const { loggedInUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "reviewer") {
      navigate("/");
    }
    setIdeas(IdeasData.filter((idea) => idea.status === "Pending"));
  }, [loggedInUser, navigate]);

  const updateIdeaStatus = (ideaKey, status) => {
    const updatedIdeas = ideas.map((idea) =>
      idea.key === ideaKey ? { ...idea, status, comment } : idea
    );

    setIdeas(updatedIdeas);
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    message.success(`Idea ${status} successfully!`);
    setModalVisible(false);
    setComment("");
  };

  const showModal = (type, idea) => {
    setModalType(type);
    setSelectedIdea(idea);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!comment.trim()) {
      message.error("Please provide a reason.");
      return;
    }
    updateIdeaStatus(selectedIdea.key, modalType === "accept" ? "Approved" : "Rejected");
  };

  const columns = [
    { title: "Idea Title", dataIndex: "title", key: "title" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "User", dataIndex: "username", key: "username" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "orange" : status === "Approved" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "View Details",
      key: "view",
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/idea-details/${record.key}`)}
        >
          View
        </Button>
      ),
    },
  ];
  const hasPendingStatus = ideas.some((idea) => idea.status === "Pending");
  if (hasPendingStatus) {
    columns.push(
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => showModal("accept", record)}
            >
              Accept
            </Button>
            <Button type="danger" icon={<CloseOutlined />} onClick={() => showModal("reject", record)}>
              Reject
            </Button>
          </>
        ),
      });
  }
   

  return (
    <Layout className="layout-container">
      <Header className="site-header">
        <div className="header-content">
          <Title level={3} className="welcome-message">
            Welcome, {loggedInUser?.name}!
          </Title>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={() => navigate("/")}
            className="logout-button"
          >
            Logout
          </Button>
        </div>
      </Header>

      <Layout style={{ display: "flex" }}>
        <Sider width={240} className="sidebar" theme="dark">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="ideasList" icon={<AppstoreOutlined />}>
              Pending Ideas
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Content className="content-area">
            <Card className="card-header">
              <h2>Review, approve, or reject ideas submitted by users!</h2>
            </Card>
            <Table columns={columns} dataSource={ideas} pagination={{ pageSize: 5 }} rowKey="key" />

            {/* Accept/Reject Modal */}
            <Modal
              title={modalType === "accept" ? "Provide Approval Reason" : "Provide Rejection Reason"}
              visible={modalVisible}
              onOk={handleSubmit}
              onCancel={() => setModalVisible(false)}
              okText="Submit"
              cancelText="Cancel"
              okButtonProps={{ type: modalType === "accept" ? "primary" : "danger" }}
            >
              <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your reason..."
              />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default ReviewerDashboard;
