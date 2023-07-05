import React from 'react'
import { Button, Table, Tag, Popconfirm, Popover, Switch } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
import { CheckCircleOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'



function undeleteItem(item) {
  // console.log(item)
  console.log("取消删除成功！")
}
export default function RightList() {
  const [dataSource, setdataSource] = useState([])
  const [loading, setloading] = useState(false)
  const deleteItem = (item) => {
    // console.log(item)
    if (item.grade === 1) {
      setloading(true)
      setdataSource(dataSource.filter(data => item.id !== data.id))
      // 避免删除源数据而注释
      // axios.delete(`http://localhost:5000/rights/${item.id}`)
      // console.log('删除成功！')
      setloading(false)
    } else {
      setloading(true)
      const list = dataSource.filter(data => item.rightId === data.id)[0].children.filter(data => data.id !== item.id)
      dataSource.filter(data => item.rightId === data.id)[0].children = list
      /**
      |--------------------------------------------------
      | 若是直接调用setdataSource(dataSource)，
      | 内部发生变化，不会导致页面重新渲染
      |--------------------------------------------------
      */
      // 避免删除源数据而注释
      // axios.delete(`http://localhost:5000/children/${item.id}`)
      setdataSource([...dataSource])
      setloading(false)
    }
  }
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    // console.log(item)
    item?.children?.map(data => {
      return data.pagepermisson !== undefined
        ? data.pagepermisson = (data.pagepermisson === 1 ? 0 : 1)
        : undefined;
    })
    setdataSource([...dataSource])
    // 修改原状态
    if (item.grade === 1) {
      axios.patch(`http://localhost:5000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {
      axios.patch(`http://localhost:5000/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }

  const columns = [
    {
      title: '权限编号',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag icon={<CheckCircleOutlined />} color="success">{key}</Tag>
      }
    },
    {
      title: '权限操作',
      render: (item) => {
        return <div>
          <Popover content={
            <div style={{ textAlign: "center" }}>{item.pagepermisson === 1 ? '启用：' : '禁用：'}<Switch
              checked={item.pagepermisson}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={() => switchMethod(item)}
            /></div>
          } title="配置项：" trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button icon={<EditOutlined />} shape="circle" style={{ backgroundColor: item.pagepermisson === 1 ? '#3499F8' : '#C6C9CB', color: 'white' }}></Button>
          </Popover>
          <Popconfirm
            title="删除项："
            description="确 认 删 除 此 项 ?"
            okText="确 认"
            cancelText="取 消"
            onConfirm={() => deleteItem(item)}
            onCancel={() => undeleteItem(item)}
          >
            <Button icon={<DeleteOutlined />} danger type="primary" shape="circle" ></Button>
          </Popconfirm>
        </div>
      }
    },
  ];
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children').then((res) => {
      // console.log(res)
      res.data.map((item) => {
        if (item.children.length === 0) {
          delete item.children
        }
        return item
      })
      setdataSource(res.data)
    })
  }, [])
  const itemRender = (current, type, originalElement) => {
    if (type === 'pageSize') {
      return <span>{`${current} 条/页`}</span>;
    }
    return originalElement;
  };
  return (
    <Table dataSource={dataSource} columns={columns} loading={loading} pagination={{
      showSizeChanger: true,
      defaultPageSize: 5,
      pageSizeOptions: ['2', '5', '10', '20'],
      itemRender: itemRender,
    }} />
  )
}
