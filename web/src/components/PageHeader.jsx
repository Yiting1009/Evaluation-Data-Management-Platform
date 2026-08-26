import React from 'react'

export default function PageHeader({ title, desc, extra }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}
    >
      <div>
        <h2 className="page-title">{title}</h2>
        <p className="page-desc">{desc}</p>
      </div>
      {extra}
    </div>
  )
}
