import React, { Component, useState } from 'react'
import ReactDOM from 'react-dom';
import UseVirtualTable from './component/UseVirtualTable';
import Search from './component/Search'
import List from './component/List'
import Tables from './component/Tables'
import { Divider, Radio, Table } from 'antd';
import './App.css';

// 创建并默认导出类式组件
const createDataSource = (rows, cols) => {
  const result = [];
  for (let i = 0; i < rows; i++) {
    const item = {};
    for (let j = 0; j < cols; j++) {
      item[`col_${j}`] = `ROW--${i}, COLUMN--${j}`;
    }
    result.push(item);
  }
  return result;
};
const dataSource = createDataSource(30, 15);

const createColumns = (data) => {
  const item = data[0];
  const columns = [];
  Object.keys(item).forEach((key) => {
    columns.push({
      code: key,
      name: key,
      width: 180,
    });
  });
  return columns;
};
// const columns = createColumns(dataSource);

const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    sorter: true,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
  {
    title: 'Column 9',
    dataIndex: 'address',
    key: '9',
  },
  {
    title: 'Column 10',
    dataIndex: 'address',
    key: '10',
  },
  {
    title: 'Column 11',
    dataIndex: 'address',
    key: '11',
  },
  {
    title: 'Column 12',
    dataIndex: 'address',
    key: '12',
  },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    width: 100,
    render: () => <a>action</a>,
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: '西北偏北',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: '东北不东',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: '西南偏南',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: '东西南北',
  },
];
export default class App extends Component {

  render() {
    return (
      <div>
        {/* <Search />
        <List /> */}
        <Tables />
        {/* <UseVirtualTable dataSource={dataSource} columns={columns} useVirtual /> */}
        <h2>antd Table</h2>
        <Radio.Group
        // onChange={({ target: { value } }) => {
        //   setSelectionType(value);
        // }}
        // value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1300,
          }} />
      </div>
    )
  }
}
