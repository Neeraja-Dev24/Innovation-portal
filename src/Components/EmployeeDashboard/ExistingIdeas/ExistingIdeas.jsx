import { useState, useEffect } from 'react';
import { Table, Button, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, RedoOutlined } from '@ant-design/icons';
import { useUser } from '../../../UserContext/useUser';
import { useNavigate } from 'react-router-dom';
import './ExistingIdeas.css';

const { Title } = Typography;

const ExistingIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { loggedInUser } = useUser(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!loggedInUser || loggedInUser.role !== 'employee') {
      navigate('/login'); 
      return;
    }

    fetch('http://localhost:5001/ideasdata')
      .then((response) => response.json())
      .then((data) => {
        const userIdeas = data.filter((idea) => idea.user_id === loggedInUser.user_id);
        setIdeas(userIdeas);
      })
      .catch((error) => {
        console.error('Error fetching ideas:', error);
      })
      .finally(() => setLoading(false));
  }, [loggedInUser, navigate]);

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/ideasdata/${id}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete idea');
        }
        // Remove the deleted idea from state
        setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
        message.success('Idea deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting idea:', error);
        message.error('Error deleting idea. Please try again later.');
      });
  };
  const handleView = (id) => {
    navigate(`/employee-dashboard/details/${id}`);
  };


  const handleEdit = (ideaData) => {
    navigate(`/employee-dashboard/submitIdea/${ideaData.id}`);
  };

  
  const handleResubmit = (ideaData) => {
    navigate(`/employee-dashboard/submitIdea/${ideaData.id}`);
  };

  const columns = [
    {
      title: 'Idea Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Published Date',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      sorter: (a, b) => a.publishedDate.localeCompare(b.publishedDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let statusClass = '';
        if (status === 'Pending') {
          statusClass = 'status-pending';
        } else if (status === 'Approved') {
          statusClass = 'status-approved';
        } else {
          statusClass = 'status-rejected';
        }
        return <span className={statusClass}>{status}</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'Pending') {
          return (
            <div className="action-buttons">
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
            </div>
          );
        } else if (record.status === 'Rejected') {
          return (
            <div className="action-buttons">
              <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
              <Button type="default" icon={<RedoOutlined />} onClick={() => handleResubmit(record)}>
                Resubmit
              </Button>
            </div>
          );
        } else {
          return (
            <div className="action-buttons">
              <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
            </div>
          );
        }
      },
    },
  ];

  return (
    <div className="myidea-container">
      <Title level={4} className="section-title">My Ideas</Title>
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={ideas}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default ExistingIdeas;
