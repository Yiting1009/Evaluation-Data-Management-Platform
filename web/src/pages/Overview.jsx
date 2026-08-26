import React from 'react'
import { Row, Col, Card, Statistic, Progress, Tag, List } from 'antd'
import {
  DatabaseOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  FileDoneOutlined
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import PageHeader from '../components/PageHeader.jsx'
import { modelMetrics, tagDistribution } from '../mock/data.js'

export default function Overview() {
  const stats = [
    { title: '题库总数', value: 3, suffix: '个', icon: <DatabaseOutlined />, color: '#4f8cff' },
    { title: '评测模型', value: 3, suffix: '个', icon: <ExperimentOutlined />, color: '#7c5cff' },
    { title: '已质检样本', value: 742, suffix: '条', icon: <CheckCircleOutlined />, color: '#16a34a' },
    { title: '生成报告', value: 12, suffix: '份', icon: <FileDoneOutlined />, color: '#f59e0b' }
  ]

  const barOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    legend: { data: ['平均分'] },
    xAxis: { type: 'category', data: modelMetrics.map((m) => m.model) },
    yAxis: { type: 'value', max: 4 },
    series: [
      {
        name: '平均分',
        type: 'bar',
        barWidth: 34,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: '#4f8cff'
        },
        data: modelMetrics.map((m) => m.avg)
      }
    ]
  }

  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, type: 'scroll' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        data: tagDistribution
      }
    ]
  }

  return (
    <>
      <PageHeader
        title="总览"
        desc="平台核心资产与最新评测态势一览"
      />
      <Row gutter={16}>
        {stats.map((s) => (
          <Col span={6} key={s.title}>
            <Card className="soft-card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Statistic title={s.title} value={s.value} suffix={s.suffix} />
                <div
                  style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: s.color + '18', color: s.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22
                  }}
                >
                  {s.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={14}>
          <Card className="soft-card" title="各模型平均分对比">
            <ReactECharts option={barOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card className="soft-card" title="问题标签分布">
            <ReactECharts option={pieOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card className="soft-card" title="模型可用率">
            {modelMetrics.map((m) => (
              <div key={m.model} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>{m.model}</span>
                  <span style={{ color: '#4f8cff' }}>{(m.usable * 100).toFixed(0)}%</span>
                </div>
                <Progress percent={Math.round(m.usable * 100)} showInfo={false} strokeColor="#4f8cff" />
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card className="soft-card" title="最近动态">
            <List
              size="small"
              dataSource={[
                { t: 'GPT-Audio 4o 已完成挂载，320/320 匹配', tag: '挂载' },
                { t: 'ES-2026Q3 质检进度达到 82%', tag: '质检' },
                { t: '标签「过时信息」已停用', tag: '标签' },
                { t: '生成《2026Q3 语音模型评测报告》初稿', tag: '报告' }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Tag color="blue">{item.tag}</Tag>
                  {item.t}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
