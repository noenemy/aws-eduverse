import React from 'react';
import './App.css';
import Lobby from './components/game';
import { Layout, Menu } from 'antd';
import {
  VideoCameraOutlined,
  UsergroupAddOutlined,
  OneToOneOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {

  const [collapsed, setCollapsed] = useState(false);
  
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  
  return (
    <div className="App">
      <Layout  style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0 }} />
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<UsergroupAddOutlined style={{ fontSize: '26px' }} />}>
                Auditorium
              </Menu.Item>
              <Menu.Item key="2" icon={<VideoCameraOutlined style={{ fontSize: '26px' }}/>}>
                Classroom
              </Menu.Item>
              <Menu.Item key="9" icon={<OneToOneOutlined style={{ fontSize: '26px' }}/>}>
                VR Lecture
              </Menu.Item>
              {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu> */}
              
            </Menu>
          </Sider>
          <Content><Lobby /></Content>
          {/* <Footer style={{ textAlign: 'center' }}>Eduverse ©2022 Created by AWS</Footer> */}
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
