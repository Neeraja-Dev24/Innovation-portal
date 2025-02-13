import { Table, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useUser } from "../../../UserContext/useUser";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ApprovedIdeas.css";

const { Title } = Typography;

const ApprovedIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const { loggedInUser } = useUser();

  // Define the function outside useEffect so it can be used in columns
  const handleDetailPage = (id) => {
   (loggedInUser && loggedInUser.role === "employee") ?
      navigate(`/employee-dashboard/details/${id}`) :
      navigate(`/reviewer-dashboard/details/${id}`) 
    
  };

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login"); 
      return;
    }
    fetch("http://localhost:5001/ideasdata")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setIdeas(data.filter((item) => item.status === "Approved"));
        }
      })
      .catch((error) => {
        console.error("Error fetching ideas:", error);
      })
      .finally(() => setLoading(false));
  }, [loggedInUser, navigate]);

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

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <div className="approved-ideas-container">
      <Title level={4} className="section-title">Approved Ideas</Title>
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
};

export default ApprovedIdeas;
