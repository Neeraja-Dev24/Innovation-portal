import { useState, useCallback, lazy, Suspense } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Select,
  Row,
  Col,
  Card,
  Layout,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const { Content } = Layout;
const HeaderNav = lazy(() => import("../../Header/HeaderNav"));

function Signup() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = useCallback(
    async (values) => {
      setLoading(true);

      if (values.password !== values.confirmPassword) {
        message.error("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.fullName,
            role: values.role,
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Signup failed. Please try again.");
        }

        message.success("Signup successful!");
        navigate("/login");
      } catch (error) {
        setErrorMsg(error.message || "An error occurred. Please try again.");
        message.error(error.message || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <HeaderNav />
      </Suspense>
      <Content>
        <div className="signup-container">
          <Row justify="center" align="middle" className="signup-row">
            <Col xs={24} sm={18} md={12} lg={8}>
              <Card title="Sign Up" bordered={false} className="signup-card">
                <Form name="signup" layout="vertical" onFinish={handleSignup}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your username!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your username"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Invalid email format!" },
                    ]}
                  >
                    <Input
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="User Role"
                    name="role"
                    rules={[
                      { required: true, message: "Please select your role!" },
                    ]}
                  >
                    <Select placeholder="Select your role">
                      <Select.Option value="employee">Employee</Select.Option>
                      <Select.Option value="reviewer">Reviewer</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="Enter your password"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          return value && getFieldValue("password") === value
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Passwords do not match!")
                              );
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="Confirm your password"
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
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>
                {errorMsg && (
                  <Typography.Text type="danger" className="error-message">
                    {errorMsg}
                  </Typography.Text>
                )}
                <Row justify="center">
                  <Col>
                    <Typography.Link onClick={() => navigate("/login")}>
                      Already have an account? Login
                    </Typography.Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default Signup;
