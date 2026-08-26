import React from 'react'
import { Card, Row, Col, Table, Tag, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import PageHeader from '../components/PageHeader.jsx'
import { modelMetrics, pointDistribution } from '../mock/data.js'

const metricDefs = [
  { name: '平均分', def: '所有已打分轮次分值的算术平均 = SUM(分值)/COUNT(分值)' },
  { name: '可用率', def: '分值 ≥ 3 的轮次数 / 已打分轮次总数' },
  { name: '满分率', def: '分值 = 4 的轮次数 / 已打分轮次总数' },
  { name: '劝退率', def: '分值 = 1 的轮次数 / 已打分轮次总数' }
]

export default function Metrics() {
  const columns = [
    { title: '模型', dataIndex: 'model', render: (v) => <b>{v}</b> },
    { title: '平均分', dataIndex: 'avg', render: (v) => <Tag color="blue">{v.toFixed(2)}</Tag> },
    { title: '可用率', dataIndex: 'usable', render: (v) => `${(v * 100).toFixed(1)}%` },
    { title: '满分率', dataIndex: 'full', render: (v) => `${(v * 100).toFixed(1)}%` },
    { title: '劝退率', dataIndex: 'reject', render: (v) => <span className="diff-down">{(v * 100).toFixed(1)}%</span> }
  ]

  const radarOption = {
    tooltip: {},
    legend: { data: modelMetrics.map((m) => m.model), bottom: 0 },
    radar: {
      indicator: [
        { name: '平均分', max: 4 },
        { name: '可用率', max: 1 },
        { name: '满分率', max: 1 },
        { name: '低劝退', max: 1 }
      ],
      radius: '65%'
    },
    series: [
      {
        type: 'radar',
        data: modelMetrics.map((m) => ({
          name: m.model,
          value: [m.avg, m.usable, m.full, 1 - m.reject],
          areaStyle: { opacity: 0.1 }
        }))
      }
    ]
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: pointDistribution.map((p) => p.name) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar', barWidth: 30,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: '#7c5cff' },
        data: pointDistribution.map((p) => p.value)
      }
    ]
  }

  return (
    <>
      <PageHeader
        title="指标自动计算"
        desc="内置指标口径，随数据入库自动计算，无需手写公式、告别 #VALUE! 报错"
      />

      <Row gutter={16} style={{ marginBottom: 16 }}>
        {metricDefs.map((m) => (
          <Col span={6} key={m.name}>
            <Card className="soft-card" size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <b style={{ color: '#4f8cff' }}>{m.name}</b>
                <Tooltip title={m.def}>
                  <InfoCircleOutlined style={{ color: '#b0b8c4' }} />
                </Tooltip>
              </div>
              <div style={{ fontSize: 12, color: '#8c96a5', marginTop: 6, minHeight: 40 }}>
                {m.def}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="soft-card" title="各模型指标总览" style={{ marginBottom: 16 }}>
        <Table rowKey="model" columns={columns} dataSource={modelMetrics} pagination={false} />
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card className="soft-card" title="模型能力雷达">
            <ReactECharts option={radarOption} style={{ height: 320 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="soft-card" title="考察点样本分布">
            <ReactECharts option={barOption} style={{ height: 320 }} />
          </Card>
        </Col>
      </Row>
    </>
  )
}
