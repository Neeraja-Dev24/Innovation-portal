import { Form, Input, Select, Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useUser } from "../../../UserContext/useUser";
import { Categories } from "../../../Data/Categories";
import { useParams, useNavigate } from "react-router-dom";
import "./SubmitIdea.css";

const { Title } = Typography;
const { Option } = Select;

const SubmitIdeas = () => {
  const { loggedInUser } = useUser();
  const { ideaId } = useParams() || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  // Introduce a state variable for the editor key to force remount when preloaded data changes
  const [editorKey, setEditorKey] = useState(`editor-${ideaId || "new"}`);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    }
  }, [loggedInUser, navigate]);
  

  // If an ideaId exists, fetch its data to pre-fill the form
  useEffect(() => {
    if (ideaId) {
      fetch(`http://localhost:5001/ideasdata/${ideaId}`)
        .then((response) => response.json())
        .then((data) => {
          form.setFieldsValue({
            category: data.category,
            title: data.title,
          });
          setEditorContent(data.description || "");
          setEditorKey(`editor-${ideaId}-${Date.now()}`);
          if (data.files) {
            setFileList(
              data.files.map((file, index) => ({
                uid: index,
                name: file.name,
                status: "done",
                url: file.url,
              }))
            );
          }
        })
        .catch((error) => {
          message.error(error, "Failed to load idea data for editing.");
        });
    }
  }, [ideaId, form]);

  // Format date as YYYY-MM-DD
  const getFormattedDate = () => new Date().toISOString().split("T")[0];

  const handleSubmitIdea = async (values) => {
    if (!loggedInUser) {
      message.error("You must be logged in to submit an idea.");
      return;
    }

    setLoading(true);

    try {
      const uploadedFiles = fileList.map((file) => ({
        name: file.name,
        type: file.type,
        url: file.url || URL.createObjectURL(file.originFileObj),
      }));

      // Build the idea data object
      const ideaData = {
        ...values,
        description: editorContent, 
        status: "Pending",
        files: uploadedFiles,
        user_id: loggedInUser.user_id,
        username: loggedInUser.username,
        email:loggedInUser.email,
        reviewerDetails: [],
        publishedDate: getFormattedDate(),
        acceptedCount: 0,
      };

      if (ideaId) {
        // Editing an existing idea: update via PUT
        ideaData.id = parseInt(ideaId, 10);
        ideaData.key = ideaData.id;
        const putResponse = await fetch(
          `http://localhost:5001/ideasdata/${ideaId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ideaData),
          }
        );
        if (!putResponse.ok) {
          throw new Error("Failed to update idea");
        }
        message.success("Idea updated successfully!");
      } else {
        // Creating a new idea: first determine a new id
        const response = await fetch("http://localhost:5001/ideasdata");
        const data = await response.json();
        const lastId =
          data.length > 0 ? Math.max(...data.map((idea) => idea.id)) : 0;
        ideaData.id = lastId + 1;
        ideaData.key = ideaData.id;
        const postResponse = await fetch("http://localhost:5001/ideasdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ideaData),
        });
        if (!postResponse.ok) {
          throw new Error("Failed to submit idea");
        }
        message.success("Idea submitted successfully!");
      }

      form.resetFields();
      setEditorContent("");
      setFileList([]);
      navigate("/employee-dashboard/myIdeas");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => setEditorContent(content || "");
  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <div>
      <Title level={4} className="section-title">
        {ideaId ? "Edit/Resubmit Idea" : "Submit New Idea"}
      </Title>
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
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Editor
            key={editorKey} // Force remount when editorKey changes
            apiKey="pyg71w9pizva6cm2w5hhln7jp5n1zicvu8cedgpdgjsox8h5"
            value={editorContent}
            init={{
              height: 200,
              menubar: false,
              plugins: ["link", "lists", "advlist"],
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
            }}
            onEditorChange={handleEditorChange}
          />
        </Form.Item>
        <Form.Item
          label="Upload Supporting Documents (Zip, Jar, Gif, Image, PDF)"
          name="files"
        >
          <Upload
            beforeUpload={() => false}
            listType="text"
            fileList={fileList}
            multiple
            onChange={handleFileChange}
            className="custom-upload-list"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
          {ideaId ? "Update" : "Submit"} 
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitIdeas;
