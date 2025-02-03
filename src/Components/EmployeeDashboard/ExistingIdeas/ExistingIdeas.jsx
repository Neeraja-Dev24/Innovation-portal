import { Table, Button, Typography, message } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useUser } from '../../../UserContext/UserContext';

const { Title } = Typography;

const ExistingIdeas = ({ ideas, setIdeas }) => {
  console.log("ideas",ideas)
  const { loggedInUser } = useUser(); // Get logged-in user

  if (!loggedInUser) {
    return <p>Please log in to view your ideas.</p>;
  }

  // Filter ideas to show only those submitted by the logged-in user
  const userIdeas = ideas.filter((idea) => idea.user_id === loggedInUser.user_id);

  const handleDelete = (key) => {
    setIdeas(userIdeas.filter((idea) => idea.key !== key));
    message.success('Deleted successfully');
  };

  const hasPendingStatus = userIdeas.some((idea) => idea.status === "Pending");

  const columns = [
    { title: 'Idea Title', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: 'Category', dataIndex: 'category', key: 'category', sorter: (a, b) => a.category.localeCompare(b.category) },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'file',
      render: (_, record) =>
        record.fileType === 'image' ? (
          <img src={record.fileUrl} alt="Idea" className="image-preview" />
        ) : (
          <Button type="link" icon={<EyeOutlined />} onClick={() => window.open(record.fileUrl, '_blank')}>
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
    <div>
      <Title level={4} className="section-title">My Ideas</Title>
      <Table columns={columns} dataSource={userIdeas} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ExistingIdeas;
