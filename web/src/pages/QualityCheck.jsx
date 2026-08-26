import React, { useState } from 'react'
import {
  Card, Table, Tag, Rate, Select, Row, Col, Progress, Button, Input, Space, Typography, message
} from 'antd'
import { SoundOutlined, SaveOutlined } from '@ant-design/icons'
import PageHeader from '../components/PageHeader.jsx'
import { qcItems } from '../mock/data.js'

const { Text } = Typography

const allTags = [
  '指令跟随-正确', '真实性-事实性错误', '内容价值-劝退',
  '多轮-上下文丢失', '安全-违规输出', '音频理解-需求理解'
]

const scoreColor = { 1: 'red', 2: 'orange', 3: 'blue', 4: 'green' }

export default function QualityCheck() {
  const [data, setData] = useState(qcItems)

  const done = data.filter((d) => d.status === 'done').length
  const total = data.length
  const percent = Math.round((done / total) * 100)

  const update = (key, field, value) => {
    setData((prev) => prev.map((d) => (d.key === key ? { ...d, [field]: value } : d)))
  }

  const columns = [
    {
      title: '题目', width: 260,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.userQuery}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {r.sampleId} · {r.session} · R{r.round}
          </Text>
        </div>
      )
    },
    {
      title: '模型回复', dataIndex: 'modelReply',
      render: (v) => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Button size="small" type="text" icon={<SoundOutlined />} title="播放音频" />
          <span>{v}</span>
        </div>
      )
    },
    {
      title: '打分', width: 150,
      render: (_, r) => (
        <Rate count={4} value={r.score} onChange={(v) => update(r.key, 'score', v)} />
      )
    },
    {
      title: '问题标签', width: 240,
      render: (_, r) => (
        <Select
          mode="multiple"
          size="small"
          style={{ width: '100%' }}
          placeholder="从体系内多选"
          value={r.tags}
          options={allTags.map((t) => ({ label: t, value: t }))}
          onChange={(v) => update(r.key, 'tags', v)}
        />
      )
    },
    {
      title: '备注', width: 160,
      render: (_, r) => (
        <Input
          size="small"
          placeholder="备注"
          value={r.note}
          onChange={(e) => update(r.key, 'note', e.target.value)}
        />
      )
    },
    {
      title: '状态', width: 90, dataIndex: 'status',
      render: (s) => (s === 'done' ? <Tag color="green">已质检</Tag> : <Tag color="orange">待质检</Tag>)
    }
  ]

  return (
    <>
      <PageHeader
        title="在线质检"
        desc="逐条打分、改标签、写备注；支持音频点击播放与多模型回复对照，告别 Excel 搬运"
        extra={
          <Button type="primary" icon={<SaveOutlined />} onClick={() => message.success('质检结果已保存')}>
            保存进度
          </Button>
        }
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Card className="soft-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <Text type="secondary">质检进度看板</Text>
                <Progress percent={percent} strokeColor="#4f8cff" />
              </div>
              <Space size="large">
                <Statistic label="已质检" value={done} color="#16a34a" />
                <Statistic label="待质检" value={total - done} color="#f59e0b" />
                <Statistic label="总数" value={total} color="#4f8cff" />
              </Space>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="soft-card">
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[1, 2, 3, 4].map((s) => (
                <div key={s} style={{ textAlign: 'center' }}>
                  <Tag color={scoreColor[s]} style={{ marginBottom: 4 }}>{s} 分</Tag>
                  <div style={{ fontWeight: 600 }}>
                    {data.filter((d) => d.score === s).length}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="soft-card" title="质检明细">
        <Table rowKey="key" columns={columns} dataSource={data} pagination={false} />
      </Card>
    </>
  )
}

function Statistic({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: '#8c96a5' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color }}>{value}</div>
    </div>
  )
}
