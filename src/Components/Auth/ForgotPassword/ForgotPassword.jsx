import { useState,lazy, Suspense } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Layout,
  Row,
  Col,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { Content } from "antd/es/layout/layout";

const HeaderNav = lazy(() => import("../../Header/HeaderNav"));

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    const { email, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      message.success("Password updated successfully!");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderNav />
      </Suspense>
      <Content>
        <Row
          justify="center"
          align="middle"
          className="forgot-password-container"
        >
          <Col xs={24} sm={18} md={12} lg={8} xl={8}>
            <Card
              title="Reset Password"
              bordered={false}
              className="forgot-password-card"
            >
              <Form
                name="forgot-password"
                layout="vertical"
                onFinish={handleResetPassword}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your registered email!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your email" autoComplete="email" />
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Please enter a new password!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
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
};

export default ForgotPassword;
