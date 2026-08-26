import React, { useState } from 'react'
import { Layout, Menu, Avatar, Badge, theme } from 'antd'
import {
  DatabaseOutlined,
  CloudUploadOutlined,
  AuditOutlined,
  BarChartOutlined,
  SwapOutlined,
  TagsOutlined,
  FileTextOutlined,
  BellOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'

import Overview from './pages/Overview.jsx'
import QuestionBank from './pages/QuestionBank.jsx'
import ModelMount from './pages/ModelMount.jsx'
import QualityCheck from './pages/QualityCheck.jsx'
import Metrics from './pages/Metrics.jsx'
import Compare from './pages/Compare.jsx'
import TagManage from './pages/TagManage.jsx'
import Report from './pages/Report.jsx'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/overview', icon: <DashboardOutlined />, label: '总览' },
  { key: '/bank', icon: <DatabaseOutlined />, label: '题库管理' },
  { key: '/mount', icon: <CloudUploadOutlined />, label: '模型数据挂载' },
  { key: '/qc', icon: <AuditOutlined />, label: '在线质检' },
  { key: '/metrics', icon: <BarChartOutlined />, label: '指标计算' },
  { key: '/compare', icon: <SwapOutlined />, label: '多模型对比' },
  { key: '/tags', icon: <TagsOutlined />, label: '标签管理' },
  { key: '/report', icon: <FileTextOutlined />, label: '报告生成' }
]

export default function App() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        style={{ background: '#0f1b33' }}
      >
        <div className="logo-box">
          <span className="logo-dot">评</span>
          {!collapsed && <span>评测数据平台</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eef1f6'
          }}
        >
          <div style={{ fontWeight: 600, color: '#1f2d3d' }}>
            模型评测数据管理与分析
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#7a8699' }} />
            </Badge>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ background: token.colorPrimary }}>产</Avatar>
              <span style={{ color: '#4b5563' }}>产品-Iris</span>
            </div>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/bank" element={<QuestionBank />} />
            <Route path="/mount" element={<ModelMount />} />
            <Route path="/qc" element={<QualityCheck />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/tags" element={<TagManage />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}
