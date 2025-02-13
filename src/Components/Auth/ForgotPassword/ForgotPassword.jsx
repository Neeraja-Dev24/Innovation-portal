import { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Layout,Row,Col,Card } from "antd";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { Content } from "antd/es/layout/layout";
import HeaderNav from "../../Header/HeaderNav";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleResetPassword = (values) => {
    const { email, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    const user = users.find((user) => user.email === email);
    if (!user) {
      message.error("Email not found!");
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Password updated successfully!");
          navigate("/login");
        } else {
          message.error("Failed to update password.");
        }
      })
      .catch((error) => console.error("Error updating password:", error))
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <HeaderNav/>
      <Content>
      <Row justify="center" align="middle" className="forgot-password-container">
      <Col xs={24} sm={18} md={12} lg={8} xl={8}>
      <Card title="Reset Password" bordered={false} className="forgot-password-card">
        <Form name="forgot-password" layout="vertical" onFinish={handleResetPassword}>
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ required: true, type: "email", message: "Please enter your registered email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item 
            label="New Password" 
            name="newPassword" 
            rules={[{ required: true, message: "Please enter a new password!" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item 
            label="Confirm Password" 
            name="confirmPassword" 
            rules={[{ required: true, message: "Please confirm your password!" }]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
        <Typography.Link onClick={() => navigate("/login")}>
          Back to Login
        </Typography.Link>
      </Card>
      </Col>
    </Row>
      </Content>
    </Layout>
  );
}

export default ForgotPassword;
