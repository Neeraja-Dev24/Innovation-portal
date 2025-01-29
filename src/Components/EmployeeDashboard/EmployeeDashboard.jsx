import { useState, useEffect } from 'react';
import { Layout, Typography, Button, Form, Input, Table, message, Upload, Select, Modal } from 'antd';
import { UploadOutlined,DeleteOutlined,EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext/UserContext';
import { IdeasData } from '../../Data/IdeasData';
import { Categories } from '../../Data/Categories';


import './EmployeeDashboard.css';

const { Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;

const EmployeeDashboard = () => {
  const { loggedInUser, setLoggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  // Form data for new idea submission
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'employee') {
      navigate('/'); // Redirect to login if not an employee
    }

    // Simulate fetching ideas (Replace with real API call)
    setIdeas(IdeasData);
  }, [loggedInUser, navigate]);

  const handleDelete = (key) => {
    setIdeas(ideas.filter((idea) => idea.key !== (key)));
    message.success('Deleted successfully');
  };

  const handleSubmitIdea = (values) => {
    setLoading(true);
    console.log(fileList)
    const fileType = fileList[0]?.type.includes('image') ? 'image' : 'pdf';
    const fileUrl = fileList[0]?.url || URL.createObjectURL(fileList[0]?.originFileObj);
    // Simulate API call to submit the idea (Replace with real API call)
    setTimeout(() => {
      setLoading(false);
      setIdeas((prevIdeas) => [
        ...prevIdeas,
        {
          key: (prevIdeas.length + 1).toString(),
          title: values.title,
          description: values.description,
          category:values.category,
          status: 'Pending',
          fileUrl: fileUrl, 
          fileType: fileType, 
        },
      ]);
      message.success('Idea submitted successfully!');
      setFileList([]); 
      form.resetFields(); 
    }, 1000);
  };

  const handleFileChange=({fileList})=>{setFileList(fileList);}

  const hasPendingStatus=ideas.some((idea)=>idea.status==="Pending");
  const columns = [
    {
      title: 'Idea Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'file',
      render: (_, record) =>
        record.fileType === 'image' ? (
          <img
            src={record.fileUrl}
            alt="Idea"
            className="image-preview"
          />
        ) : (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(record.fileUrl, '_blank')}
          >
            View PDF
          </Button>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red' }}>
          {status}
        </span>
      ),
    },
  ];
  if (hasPendingStatus) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "Pending" && (
          <div className="button-group">
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} danger />
          </div>
        ),
    });
  }
   
  return (
    
    <Layout className="site-layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="dashboard-content">
          <Title level={3}>Welcome, {loggedInUser?.name}!</Title>
          {/* Existing Ideas Table */}
          <Title level={4} className="section-title">Existing Ideas</Title>
          <Table columns={columns} dataSource={ideas} pagination={true} />
          {/* New Idea Submission Form */}
          <Title level={4} className="section-title">Submit New Idea</Title>
          <Form
            form={form}
            name="idea-form"
            onFinish={handleSubmitIdea}
            layout="vertical"
            className="idea-form"
          >
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select a category">
                {Categories.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please input your innovation title!' }]}
            >
            <Input placeholder="Enter  title" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your innovation description!' }]}
            >
              <Input.TextArea placeholder="Enter description" rows={4} />
            </Form.Item>
            <Form.Item label="Upload Supporting Document (Image/PDF)" name="file">
              <Upload beforeUpload={() => false} listType="text"  fileList={fileList} onChange={handleFileChange}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
              {fileList.length > 0 && (
                <div className="image-preview">
                  {fileList[0].type.includes('image') ? (
                    <img src={fileList[0].url || URL.createObjectURL(fileList[0].originFileObj)} alt="File preview" />
                  ) : (
                    <iframe src={fileList[0].url || URL.createObjectURL(fileList[0].originFileObj)} title="File preview" />
                  )}
                </div>
              )} 
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Submit 
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default EmployeeDashboard;
