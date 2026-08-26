import React, { useState } from 'react'
import {
  Card, Row, Col, Select, Button, Space, Table, Tag, Divider, Typography, Empty, message
} from 'antd'
import { FileWordOutlined, ThunderboltOutlined, ShareAltOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import PageHeader from '../components/PageHeader.jsx'
import { modelMetrics, tagDistribution, badcases } from '../mock/data.js'

const { Title, Paragraph, Text } = Typography

export default function Report() {
  const [generated, setGenerated] = useState(false)

  const metricCols = [
    { title: '模型', dataIndex: 'model' },
    { title: '平均分', dataIndex: 'avg', render: (v) => v.toFixed(2) },
    { title: '可用率', dataIndex: 'usable', render: (v) => `${(v * 100).toFixed(1)}%` },
    { title: '满分率', dataIndex: 'full', render: (v) => `${(v * 100).toFixed(1)}%` },
    { title: '劝退率', dataIndex: 'reject', render: (v) => `${(v * 100).toFixed(1)}%` }
  ]

  const badCols = [
    { title: '类型', dataIndex: 'type', render: (t) => <Tag color="red">{t}</Tag> },
    { title: 'Query', dataIndex: 'query' },
    { title: '模型回复', dataIndex: 'reply' },
    { title: '标签', dataIndex: 'tags', render: (ts) => ts.map((t) => <Tag key={t}>{t}</Tag>) },
    { title: '来源模型', dataIndex: 'model' }
  ]

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    series: [{ type: 'pie', radius: ['40%', '68%'], itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, data: tagDistribution }]
  }

  return (
    <>
      <PageHeader
        title="报告生成"
        desc="选定评测集 + 对比模型，一键生成结构化报告初稿，支持在线编辑结论后导出 Word"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} disabled={!generated}>在线分享</Button>
            <Button type="primary" icon={<FileWordOutlined />} disabled={!generated} onClick={() => message.success('已导出 Word')}>
              导出 Word
            </Button>
          </Space>
        }
      />

      <Card className="soft-card" style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <Space>
            <span style={{ color: '#7a8699' }}>评测集：</span>
            <Select defaultValue="ES-2026Q3" style={{ width: 200 }}
              options={[{ label: 'ES-2026Q3 语音评测', value: 'ES-2026Q3' }]} />
          </Space>
          <Space>
            <span style={{ color: '#7a8699' }}>对比模型：</span>
            <Select mode="multiple" defaultValue={modelMetrics.map((m) => m.model)} style={{ minWidth: 320 }}
              options={modelMetrics.map((m) => ({ label: m.model, value: m.model }))} />
          </Space>
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => { setGenerated(true); message.success('报告初稿已生成') }}>
            一键生成报告
          </Button>
        </Space>
      </Card>

      {!generated ? (
        <Card className="soft-card">
          <Empty description="选择评测集与模型后，点击「一键生成报告」查看初稿" style={{ padding: '40px 0' }} />
        </Card>
      ) : (
        <Card className="soft-card">
          <Typography>
            <Title level={3} style={{ textAlign: 'center' }}>2026Q3 语音模型评测报告（初稿）</Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
              评测集：ES-2026Q3 · 生成时间：2026-08-26 · 样本量：320
            </Text>

            <Title level={4}>一、指标总览</Title>
            <Table rowKey="model" size="small" columns={metricCols} dataSource={modelMetrics} pagination={false} />

            <Divider />
            <Row gutter={24}>
              <Col span={12}>
                <Title level={4}>二、问题标签分布</Title>
                <ReactECharts option={pieOption} style={{ height: 260 }} />
              </Col>
              <Col span={12}>
                <Title level={4}>三、结论摘要（可在线编辑）</Title>
                <Paragraph editable>
                  本轮评测中，GPT-Audio 4o 综合表现最佳（平均分 3.51、可用率 89%），
                  豆包-Audio v3.1 次之，Gemini 2.0 在事实性与多轮追踪上劝退率偏高（9%）。
                  主要问题集中在「事实性错误」与「劝退」两类标签，建议针对性优化知识时效性与多轮上下文保持。
                </Paragraph>
              </Col>
            </Row>

            <Divider />
            <Title level={4}>四、典型 Badcase</Title>
            <Table rowKey="key" size="small" columns={badCols} dataSource={badcases} pagination={false} />
          </Typography>
        </Card>
      )}
    </>
  )
}
