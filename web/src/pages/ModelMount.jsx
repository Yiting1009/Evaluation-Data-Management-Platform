import React, { useState } from 'react'
import { Card, Table, Tag, Button, Space, Modal, Upload, Alert, Row, Col, Statistic } from 'antd'
import { UploadOutlined, InboxOutlined, CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons'
import PageHeader from '../components/PageHeader.jsx'
import { submissions } from '../mock/data.js'

const { Dragger } = Upload

export default function ModelMount() {
  const [open, setOpen] = useState(false)

  const columns = [
    { title: '模型', dataIndex: 'modelName', render: (v, r) => <b>{v} {r.modelVersion}</b> },
    { title: '所属评测集', dataIndex: 'evalSet', render: (v) => <Tag color="blue">{v}</Tag> },
    { title: '上传时间', dataIndex: 'uploadedAt', width: 120 },
    {
      title: '匹配情况', width: 160,
      render: (_, r) => (
        <Space>
          <Tag color="green">匹配 {r.matched}</Tag>
          {r.unmatched > 0 ? <Tag color="red">未匹配 {r.unmatched}</Tag> : <Tag>无异常</Tag>}
        </Space>
      )
    },
    {
      title: '基线', dataIndex: 'isBaseline', width: 80,
      render: (b) => (b ? <Tag color="gold">基线</Tag> : <a>设为基线</a>)
    }
  ]

  return (
    <>
      <PageHeader
        title="模型数据挂载"
        desc="上传标注结果 Excel，智能识别「模型回复 / 最终-打分 / 最终-问题标签」列组，按唯一键自动挂载到题库"
        extra={
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setOpen(true)}>
            上传标注结果
          </Button>
        }
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card className="soft-card stat-card">
            <Statistic title="已挂载模型" value={3} suffix="个" valueStyle={{ color: '#4f8cff' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="soft-card stat-card">
            <Statistic title="累计匹配题目" value={958} valueStyle={{ color: '#16a34a' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="soft-card stat-card">
            <Statistic title="待处理异常" value={2} suffix="条" valueStyle={{ color: '#dc2626' }} />
          </Card>
        </Col>
      </Row>

      <Card className="soft-card" title="已挂载模型答卷（ES-2026Q3）">
        <Table rowKey="id" columns={columns} dataSource={submissions} pagination={false} />
      </Card>

      <Modal
        title="上传标注结果 Excel"
        open={open}
        width={680}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        okText="确认挂载"
      >
        <Dragger beforeUpload={() => false} maxCount={1} style={{ marginBottom: 16 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">拖入标管导出的 xlsx</p>
          <p className="ant-upload-hint">兼容一表多模型，自动识别表头</p>
        </Dragger>
        <Alert
          style={{ marginBottom: 10 }}
          type="success" showIcon icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          message="智能列映射完成：识别到 1 个模型列组（GPT-Audio 4o）"
        />
        <Alert
          type="warning" showIcon icon={<WarningTwoTone twoToneColor="#faad14" />}
          message="匹配校验：2 条题目未在题库中找到（可能为多题），无打分越界与标签越界"
        />
      </Modal>
    </>
  )
}
