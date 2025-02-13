import { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext/useUser";
import "./Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleLogin = (values) => {
    setLoading(true);
    const user = users.find(
      (user) =>
        user.username === values.username && user.password === values.password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);
      setUser({
        name: user.name,
        role: user.role,
        username: user.username,
        email: user.email,
        user_id: user.id,
      });

      message.success("Login successful!");
      setLoading(false);
      setTimeout(() => {
        if (user.role === "employee") {
          navigate("/employee-dashboard/approvedIdeas");
        } else if (user.role === "reviewer") {
          navigate("/reviewer-dashboard");
        }
      }, 1500);
    } else {
      message.error("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" className="login-row">
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card title="Login" bordered={false} className="login-card">
            <Form name="login" layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                ]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Row justify="space-between">
              <Col>
                <Typography.Link onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </Typography.Link>
              </Col>
              <Col>
                <Typography.Link onClick={() => navigate("/signup")}>
                  {`Don't have an account? Sign Up`}
                </Typography.Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
