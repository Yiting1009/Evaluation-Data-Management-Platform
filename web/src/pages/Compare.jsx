import React, { useState } from 'react'
import { Card, Table, Select, Space, Tag, Button, Segmented } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons'
import PageHeader from '../components/PageHeader.jsx'
import { modelMetrics } from '../mock/data.js'

export default function Compare() {
  const [selected, setSelected] = useState(modelMetrics.map((m) => m.model))
  const [baseline, setBaseline] = useState(modelMetrics[0].model)
  const [dim, setDim] = useState('总体')

  const base = modelMetrics.find((m) => m.model === baseline)

  const renderDiff = (val, baseVal, isReject = false) => {
    const diff = val - baseVal
    if (Math.abs(diff) < 1e-6) return <span style={{ color: '#9ca3af' }}>—</span>
    // 劝退率下降是好事：跌绿涨红；其余指标涨绿跌红
    const good = isReject ? diff < 0 : diff > 0
    const cls = good ? 'diff-up' : 'diff-down'
    const icon = diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
    return (
      <span className={cls}>
        {icon} {Math.abs(diff * (val <= 1 ? 100 : 1)).toFixed(val <= 1 ? 1 : 2)}
        {val <= 1 ? '%' : ''}
      </span>
    )
  }

  const rows = modelMetrics.filter((m) => selected.includes(m.model))

  const columns = [
    {
      title: '模型', dataIndex: 'model',
      render: (v) => (
        <Space>
          <b>{v}</b>
          {v === baseline && <Tag color="gold">基线</Tag>}
        </Space>
      )
    },
    {
      title: '平均分', dataIndex: 'avg',
      render: (v, r) => (
        <Space>
          <span>{v.toFixed(2)}</span>
          {r.model !== baseline && renderDiff(v, base.avg)}
        </Space>
      )
    },
    {
      title: '可用率', dataIndex: 'usable',
      render: (v, r) => (
        <Space>
          <span>{(v * 100).toFixed(1)}%</span>
          {r.model !== baseline && renderDiff(v, base.usable)}
        </Space>
      )
    },
    {
      title: '满分率', dataIndex: 'full',
      render: (v, r) => (
        <Space>
          <span>{(v * 100).toFixed(1)}%</span>
          {r.model !== baseline && renderDiff(v, base.full)}
        </Space>
      )
    },
    {
      title: '劝退率', dataIndex: 'reject',
      render: (v, r) => (
        <Space>
          <span>{(v * 100).toFixed(1)}%</span>
          {r.model !== baseline && renderDiff(v, base.reject, true)}
        </Space>
      )
    }
  ]

  return (
    <>
      <PageHeader
        title="多模型对比"
        desc="任意勾选 N 个模型版本并排对比，自动计算 DIFF（相对基线），涨绿跌红一目了然"
        extra={
          <Button icon={<DownloadOutlined />}>导出对比结果</Button>
        }
      />

      <Card className="soft-card" style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <Space>
            <span style={{ color: '#7a8699' }}>对比模型：</span>
            <Select
              mode="multiple"
              style={{ minWidth: 320 }}
              value={selected}
              onChange={setSelected}
              options={modelMetrics.map((m) => ({ label: m.model, value: m.model }))}
            />
          </Space>
          <Space>
            <span style={{ color: '#7a8699' }}>基线模型：</span>
            <Select
              style={{ minWidth: 180 }}
              value={baseline}
              onChange={setBaseline}
              options={modelMetrics.map((m) => ({ label: m.model, value: m.model }))}
            />
          </Space>
          <Space>
            <span style={{ color: '#7a8699' }}>下钻维度：</span>
            <Segmented options={['总体', '按考察点', '按问题标签']} value={dim} onChange={setDim} />
          </Space>
        </Space>
      </Card>

      <Card className="soft-card" title={`并排指标对比（基线：${baseline} · 维度：${dim}）`}>
        <Table rowKey="model" columns={columns} dataSource={rows} pagination={false} />
      </Card>
    </>
  )
}
