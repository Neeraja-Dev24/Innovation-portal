import { useState } from 'react';
import { Input,Layout } from 'antd';
import HeaderNav from '../Header/HeaderNav';
import { IdeasData } from '../../Data/IdeasData';
import { Link } from 'react-router-dom';
import './Home.css';

const { Content } = Layout;
// const { Title } = Typography;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIdeas = IdeasData.filter(idea =>
    idea.status === 'Approved' &&
    (
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchTerm.toLowerCase()) ));
  return (
    <Layout>
      <HeaderNav />
      <Content className="home-content">
        <div className="search-container">
          {/* <Title level={2}>Search Ideas</Title> */}
          <Input
            placeholder="Search for ideas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* Idea List Container */}
        <div className="idea-list">
          {filteredIdeas.map(idea => (
            <div key={idea.key} className="idea-card">
              <img alt={idea.title} src={idea.fileUrl} className="idea-image" />
              <div className="idea-content">
                <h3 className="idea-title">{idea.title} - <span className="category">{idea.category}</span></h3>
                <div className='accepted-details'>
                  <p className="accepted-count"><strong>Accepted By: &nbsp;</strong> {idea.acceptedCount || 0}</p>
                  <p><strong>Submitted by: &nbsp;</strong> {idea.username}</p>
                  </div>
              </div>
              <Link className="ideacard-view" to={`/details/${idea.key}`}>View More</Link>
            </div>
          ))}
        </div>
      </Content>
    </Layout>
  );
}
