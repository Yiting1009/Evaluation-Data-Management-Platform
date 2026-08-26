import React, { useState } from 'react'
import { Card, Row, Col, Tree, Form, Input, Switch, Button, Tag, Empty, message } from 'antd'
import { TagsOutlined, SaveOutlined } from '@ant-design/icons'
import PageHeader from '../components/PageHeader.jsx'
import { tagTree } from '../mock/data.js'

export default function TagManage() {
  const [selected, setSelected] = useState(null)
  const [form] = Form.useForm()

  const findNode = (nodes, key) => {
    for (const n of nodes) {
      if (n.key === key) return n
      if (n.children) {
        const f = findNode(n.children, key)
        if (f) return f
      }
    }
    return null
  }

  const onSelect = (keys) => {
    if (!keys.length) return
    const node = findNode(tagTree, keys[0])
    setSelected(node)
    form.setFieldsValue({ title: node.title, desc: node.desc || '', enabled: node.enabled })
  }

  // 给树节点加禁用样式标记
  const decorate = (nodes) =>
    nodes.map((n) => ({
      ...n,
      title: (
        <span>
          {n.title}
          {n.enabled === false && <Tag style={{ marginLeft: 6 }}>停用</Tag>}
        </span>
      ),
      children: n.children ? decorate(n.children) : undefined
    }))

  return (
    <>
      <PageHeader
        title="标签管理体系"
        desc="三级结构：一级维度 > 二级标签 > 问题说明；支持增删改与停用（保留历史统计口径）"
      />
      <Row gutter={16}>
        <Col span={10}>
          <Card
            className="soft-card"
            title={<span><TagsOutlined /> 标签体系</span>}
            extra={<Button size="small" type="primary">新增一级维度</Button>}
          >
            <Tree
              defaultExpandAll
              treeData={decorate(tagTree)}
              onSelect={onSelect}
              blockNode
            />
          </Card>
        </Col>
        <Col span={14}>
          <Card className="soft-card" title="标签详情">
            {selected ? (
              <Form form={form} layout="vertical" style={{ maxWidth: 480 }}>
                <Form.Item label="标签名称" name="title">
                  <Input />
                </Form.Item>
                <Form.Item label="问题说明" name="desc">
                  <Input.TextArea rows={3} placeholder="描述该标签的判定口径" />
                </Form.Item>
                <Form.Item label="启用状态" name="enabled" valuePropName="checked">
                  <Switch checkedChildren="启用" unCheckedChildren="停用" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary" icon={<SaveOutlined />}
                    onClick={() => message.success('标签已保存')}
                  >
                    保存
                  </Button>
                  <Button danger style={{ marginLeft: 8 }} onClick={() => message.info('已停用（保留历史口径）')}>
                    停用
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Empty description="从左侧选择一个标签查看/编辑" />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}
