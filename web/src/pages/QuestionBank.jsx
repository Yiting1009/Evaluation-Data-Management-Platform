import React, { useState } from 'react'
import {
  Card, Table, Button, Tag, Space, Modal, Upload, Steps, Alert, Descriptions, message
} from 'antd'
import { UploadOutlined, PlusOutlined, InboxOutlined, EyeOutlined } from '@ant-design/icons'
import PageHeader from '../components/PageHeader.jsx'
import { questionBanks, questions } from '../mock/data.js'

const { Dragger } = Upload

export default function QuestionBank() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [step, setStep] = useState(0)

  const columns = [
    { title: '题库编号', dataIndex: 'id', width: 110 },
    { title: '名称', dataIndex: 'name' },
    {
      title: '版本', dataIndex: 'version', width: 90,
      render: (v) => <Tag color="geekblue">{v}</Tag>
    },
    { title: '题目数', dataIndex: 'count', width: 90 },
    { title: '创建时间', dataIndex: 'createdAt', width: 120 },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (s) =>
        s === 'active' ? <Tag color="green">启用</Tag> : <Tag>已归档</Tag>
    },
    {
      title: '操作', width: 120,
      render: () => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => setDetailOpen(true)}>
          查看题目
        </Button>
      )
    }
  ]

  const qColumns = [
    { title: 'sample_id', dataIndex: 'sampleId', width: 100 },
    { title: 'session', dataIndex: 'session', width: 90 },
    { title: 'round', dataIndex: 'round', width: 70 },
    { title: 'user (query)', dataIndex: 'userQuery' },
    { title: 'assistant (标准回复)', dataIndex: 'assistantRef' },
    { title: '考察点', dataIndex: 'point', width: 90, render: (p) => <Tag>{p}</Tag> },
    { title: '动/静态', dataIndex: 'type', width: 80 }
  ]

  return (
    <>
      <PageHeader
        title="题库管理"
        desc="上传题库 Excel 自动解析入库，按 sample_id + session + round 建立唯一键，沉淀可复用资产"
        extra={
          <Space>
            <Button icon={<PlusOutlined />}>新建题库</Button>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => { setUploadOpen(true); setStep(0) }}>
              上传题库 Excel
            </Button>
          </Space>
        }
      />

      <Card className="soft-card">
        <Table rowKey="id" columns={columns} dataSource={questionBanks} pagination={false} />
      </Card>

      {/* 上传流程 */}
      <Modal
        title="上传题库 Excel"
        open={uploadOpen}
        width={680}
        onCancel={() => setUploadOpen(false)}
        footer={
          step < 2 ? (
            <Button type="primary" onClick={() => setStep(step + 1)}>下一步</Button>
          ) : (
            <Button type="primary" onClick={() => { setUploadOpen(false); message.success('题库已入库') }}>
              确认入库
            </Button>
          )
        }
      >
        <Steps
          current={step}
          size="small"
          style={{ marginBottom: 20 }}
          items={[{ title: '上传文件' }, { title: '解析预览' }, { title: '校验入库' }]}
        />
        {step === 0 && (
          <Dragger beforeUpload={() => false} maxCount={1}>
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽 xlsx 文件到此区域</p>
            <p className="ant-upload-hint">系统将逐题解析入库并自动识别字段</p>
          </Dragger>
        )}
        {step === 1 && (
          <>
            <Alert type="success" showIcon message="已识别 320 道题，字段映射如下" style={{ marginBottom: 12 }} />
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="唯一键">sample_id + session + round</Descriptions.Item>
              <Descriptions.Item label="user (query)">→ 已映射</Descriptions.Item>
              <Descriptions.Item label="assistant (标准回复)">→ 已映射</Descriptions.Item>
              <Descriptions.Item label="音频 url / 考察点 / 话题分类">→ 已映射</Descriptions.Item>
            </Descriptions>
          </>
        )}
        {step === 2 && (
          <Alert
            type="info" showIcon
            message="校验通过"
            description="无缺列、无重复唯一键，可安全入库。将生成版本 V1.3。"
          />
        )}
      </Modal>

      {/* 题目明细 */}
      <Modal
        title="题目明细 · 语音助手评测题库 V1.2"
        open={detailOpen}
        width={1000}
        footer={null}
        onCancel={() => setDetailOpen(false)}
      >
        <Table
          rowKey="key"
          size="small"
          columns={qColumns}
          dataSource={questions}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 900 }}
        />
      </Modal>
    </>
  )
}
