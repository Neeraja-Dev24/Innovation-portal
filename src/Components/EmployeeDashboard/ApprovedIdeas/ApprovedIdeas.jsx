import { Table, Button} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useUser } from "../../../UserContext/useUser";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import "./ApprovedIdeas.css";

const ApprovedIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loggedInUser, setUser } = useUser();

  // Retrieve stored user session on first mount
  useEffect(() => {
    if (!loggedInUser) {
      const storedUser = localStorage.getItem("loggedInUser");
      storedUser?setUser(JSON.parse(storedUser)):navigate("/login");
     
    }
  }, [loggedInUser, navigate, setUser]);

  // Fetch approved ideas
  const fetchApprovedIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/ideasdata");
      if (!response.ok) throw new Error("Failed to fetch ideas");

      const data = await response.json();
      setIdeas(data.filter((item) => item.status === "Approved"));
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedIdeas();
  }, [fetchApprovedIdeas]);

  // Navigate to detail page
  const handleDetailPage = (id) => {
    navigate(
      `/${
        loggedInUser?.role === "employee"
          ? "employee-dashboard"
          : "reviewer-dashboard"
      }/details/${id}`
    );
  };

  const columns = [
    {
      title: "Title",
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
      title: "User Name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Published Date",
      dataIndex: "publishedDate",
      key: "publishedDate",
      sorter: (a, b) => new Date(a.publishedDate) - new Date(b.publishedDate),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Approved By",
      dataIndex: "acceptedCount",
      key: "acceptedCount",
      sorter: (a, b) => a.acceptedCount - b.acceptedCount,
    },
    {
      title: "View More",
      key: "view",
      render: (_, record) => (
        <Button
          type="default"
          icon={<EyeOutlined />}
          onClick={() => handleDetailPage(record.id)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="approved-ideas-container">
      <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={ideas}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            className="custom-table"
          />
      </div>
    </div>
  );
};

export default ApprovedIdeas;
