import { useState, useEffect } from "react";
import { Table, Button, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useUser } from "../../../UserContext/useUser";
import { useNavigate } from "react-router-dom";
import "./PendingReviews.css";
const { Title } = Typography;

export default function PendingReviews() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loggedInUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== "reviewer") {
      navigate("/login");
      return;
    }
    fetch("http://localhost:5001/ideasdata")
      .then((response) => response.json())
      .then((data) => {
        // Filter data to only include ideas with status "Pending"
        const pendingIdeas = data.filter((idea) => idea.status === "Pending");
        setIdeas(pendingIdeas);
      })
      .catch((error) => {
        console.error("Error fetching ideas:", error);
      })
      .finally(() => setLoading(false));
  }, [loggedInUser, navigate]);

  const columns = [
    {
      title: "Idea Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      sorter: (a, b) => a.publishedDate.localeCompare(b.publishedDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "View Details",
      key: "view",
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/reviewer-dashboard/pendingdetails/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="myidea-container">
      <Title level={4} className="section-title">
        My Ideas
      </Title>
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={ideas}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
          className="custom-table"
        />
      </div>
    </div>
  );
}
