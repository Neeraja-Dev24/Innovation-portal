import { Form, Input, Select, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useUser } from '../../../UserContext/UserContext'; // Import useUser
import { Categories } from '../../../Data/Categories';
import './SubmitIdea.css';

const { Title } = Typography;
const { Option } = Select;

const SubmitIdea = ({ ideas, setIdeas }) => {
  const { loggedInUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const handleSubmitIdea = (values) => {
    if (!loggedInUser) {
      message.error("You must be logged in to submit an idea.");
      return;
    }

    setLoading(true);
    const fileType = fileList[0]?.type.includes('image') ? 'image' : 'pdf';
    const fileUrl = fileList[0]?.url || URL.createObjectURL(fileList[0]?.originFileObj);

    setTimeout(() => {
      setLoading(false);
      setIdeas([
        ...ideas, 
        { 
          key: (ideas.length + 1).toString(), 
          ...values, 
          description: editorContent,
          status: 'Pending', 
          fileUrl, 
          fileType, 
          user_id: loggedInUser.user_id // Store user_id in the idea
        }
      ]);
      message.success('Idea submitted successfully!');
      setFileList([]);
      setEditorContent('');
      form.resetFields();
    }, 1000);
  };

  const handleEditorChange = (content,editor) => {
    setEditorContent(content);
  };
  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <div>
      <Title level={4} className="section-title">Submit New Idea</Title>
      <Form form={form} name="idea-form" onFinish={handleSubmitIdea} layout="vertical" className="idea-form">
        <Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category!" }]}>
          <Select placeholder="Select a category">
            {Categories.map((category) => (
              <Option key={category.value} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input your title!' }]}>
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input description!' }]}>
          <Editor
            apiKey="pyg71w9pizva6cm2w5hhln7jp5n1zicvu8cedgpdgjsox8h5" // Add your TinyMCE API key here
            value={editorContent}
            init={{
              height: 400,
              menubar: true,
              plugins: ['link', 'image', 'lists', 'advlist'],
              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
            }}
            onEditorChange={handleEditorChange}
          />
        </Form.Item>
        <Form.Item label="Upload Supporting Document (Image/PDF)" name="file">
          <Upload 
            beforeUpload={() => false} 
            listType="text"  
            fileList={fileList} 
            multiple={false}
            maxCount={1}
            onChange={handleFileChange}>
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
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitIdea;
