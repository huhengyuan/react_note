import React, { useState, useEffect } from 'react'
import { Button, Table, Popconfirm, Popover, Tag, Modal, Tree } from 'antd';
import { UnorderedListOutlined, DeleteOutlined, SyncOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [isModalOpen, setisModalOpen] = useState(false)
  const preventDefault = (index, e) => {
    // e.preventDefault();
    console.log(index)
    console.log(e)
    console.log('Clicked! But prevent default.');
  };
  const getContent = (item) => {
    return (
      <div>
        {
          item.rights.map((right, index) => {
            return <Tag
              key={index}
              color="success"
              closable icon={<SyncOutlined spin />}
              onClose={(e) => preventDefault(right, e)}>{right}</Tag>
          })
        }
      </div>
    )
  }
  const columns = [
    {
      title: '角色编号',
      dataIndex: 'id',
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    }, {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleName) => {
        return <b>{roleName}</b>
      }
    }, {
      title: '角色操作',
      render: (item) => {
        return <div>
          <Button
            icon={<SettingOutlined />}
            shape="circle"
            style={{ backgroundColor: '#3499F8', color: 'white' }}
            onClick={() => { setisModalOpen(true) }}></Button>
          <Popover content={() => getContent(item)} title="角色权限列表：" trigger="hover">
            <Button icon={<UnorderedListOutlined />} shape="circle" style={{ backgroundColor: '#3499F8', color: 'white' }}></Button>
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
  ]
  useEffect(() => {
    axios.get('http://localhost:5000/roles')
      .then(res => {
        // console.log(res.data)
        setdataSource(res.data)
      })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:5000/rights?_embed=children')
      .then(res => {
        console.log(res.data)
        setrightList(res.data)
      })
  }, [])
  const deleteItem = (item) => {
    console.log(item)
  }
  const undeleteItem = (item) => {
    console.log(item)
  }
  const handleOk = () => {
    setisModalOpen(false)
  }
  const handleCancel = () => {
    setisModalOpen(false)
  }
  const onCheck = () => {

  }
  const onSelect = () => {

  }


  return (
    <div>
      <div>
        <Button type="primary" icon={<PlusOutlined />}>
          添加
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 5,
          pageSizeOptions: ['2', '5', '10', '20']
        }}
      ></Table>
      <Modal okText="确认"
        cancelText="取消"
        title="权限分配："
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      // width={300}
      // height={300}
      // bodyStyle={{ maxHeight: 'calc(100vh - 210px)', overflow: 'auto' }}
      >
        <div style={{ overflow: 'auto', width: 'auto', height: '300px' }}>
          <Tree
            checkable
            checkStrictly
            defaultCheckedKeys={['/home', '/user-manage', '/right-manage', '/news-manage', "/audit-manage", '/publish-manage']}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={rightList}
          />
        </div>
      </Modal>
    </div>
  )
}
