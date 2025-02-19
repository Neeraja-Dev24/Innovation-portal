import { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, message, Typography, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserContext/useUser";
import "./Login.css";

function Login() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { setUser, loggedInUser } = useUser();

  // Fetch users only once (memoized)
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Redirect if already logged in
  useEffect(() => {
    if (loggedInUser) {
      navigate(loggedInUser.role === "employee" ? "/employee-dashboard/approvedIdeas" : "/reviewer-dashboard/approvedIdeas");
    }
  }, [loggedInUser, navigate]);

  const handleLogin = async (values) => {
    const user = users.find(
      (u) => u.username === values.username && u.password === values.password
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
      setTimeout(() => {
        navigate(user.role === "employee" ? "/employee-dashboard/approvedIdeas" : "/reviewer-dashboard/approvedIdeas");
      }, 500);
    } else {
      message.error("Invalid username or password");
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
                rules={[{ required: true, message: "Please enter your username!" }]}
              >
                <Input placeholder="Enter your username" autoComplete="username" aria-label="Username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password placeholder="Enter your password" autoComplete="current-password" aria-label="Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block  aria-label="Login Button">
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Row justify="space-between">
              <Col>
                <Typography.Link role="link" aria-label="Forgot Password" onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                </Typography.Link>
              </Col>
              <Col>
                <Typography.Link role="link" aria-label="Sign Up" onClick={() => navigate("/signup")}>
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
