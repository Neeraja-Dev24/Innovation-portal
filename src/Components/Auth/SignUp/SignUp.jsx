import { useState } from "react";
import { Form, Input, Button, message, Typography, Select, Row, Col, Card, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import HeaderNav from "../../Header/HeaderNav";
const { Content} = Layout;

function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (values) => {
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      setLoading(false);
      return;
    }
    // User object to send to the JSON server
    const newUser = {
      name: values.fullName,
      role: values.role,
      username: values.username,
      email: values.email,
      password: values.password,
    };

    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((existingUsers) => {
        const newId = existingUsers.length ? Math.max(...existingUsers.map(user => parseInt(user.id))) + 1 : 1;
        newUser.id = newId.toString(); 

        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          .then((response) => response.json())
          .then(() => {
            message.success("Signup successful!");
            setLoading(false);
            navigate("/login"); 
          })
          .catch((error) => {
            message.error("Signup failed. Please try again.");
            console.error("Error adding user:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        message.error("Error fetching users. Please try again.");
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  return (
    <Layout>
      <HeaderNav/>
    <Content>
    <div className="signup-container">
      <Row justify="center" align="middle" className="signup-row">
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card title="Sign Up" bordered={false} className="signup-card">
            <Form name="signup" layout="vertical" onFinish={handleSignup}>
              <Form.Item 
                label="Full Name" 
                name="fullName" 
                rules={[{ required: true, message: "Please enter your full name!" }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item 
                label="Username" 
                name="username" 
                rules={[{ required: true, message: "Please enter your username!" }]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>

              <Form.Item 
                label="Email" 
                name="email" 
                rules={[{ required: true, message: "Please enter your email!" }, { type: "email", message: "Invalid email format!" }]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item 
                label="User Role" 
                name="role" 
                rules={[{ required: true, message: "Please select your role!" }]}
              >
                <Select placeholder="Select your role">
                  <Select.Option value="employee">Employee</Select.Option>
                  <Select.Option value="reviewer">Reviewer</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item 
                label="Password" 
                name="password" 
                rules={[{ required: true, message: "Please enter your password!" }]}
                hasFeedback
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              <Form.Item 
                label="Confirm Password" 
                name="confirmPassword" 
                rules={[{ required: true, message: "Please confirm your password!" }]}
                hasFeedback
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
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
