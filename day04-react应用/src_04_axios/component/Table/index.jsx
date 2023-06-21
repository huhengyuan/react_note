import React, { useState, useRef } from 'react';
import './index.css'

const Table = () => {
  const [data, setData] = useState([{ name: '张三', li: [4, 9, 5, 6] }, { name: '李四', li: [11] }]);
  const editRef = useRef('null');

  // 被操作的名字
  // 被操作的月份
  // 被操作的值
  const handleEdit = (name, month, e) => {
    const newData = [...data];
    const item = newData.find((item) => item.name === name);
    item.li[month] = parseInt(e.target.innerText);
    setData(newData);
  };

  const renderTable = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const tableData = [];

    // 添加表头
    const headerRow = [<th key="name" className='sTh'>姓名</th>];
    months.forEach((month) => {
      headerRow.push(<th key={month} className='sTh'>{month}</th>);
    });
    tableData.push(<tr key="header" className='sTh'>{headerRow}</tr>);

    // 添加数据行
    data.forEach((item) => {
      const dataRow = [<td key="name" className='sTh'>{item.name}</td>];
      months.forEach((month, index) => {
        if (item.li.includes(index + 1)) {
          const value = item.li[index + 1] || '';
          dataRow.push(
            <td
              key={month}
              style={{ backgroundColor: 'red' }}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleEdit(item.name, month, e)}
              ref={editRef}
              className='sTh'
            >
              {value}
            </td>
          );
        } else {
          dataRow.push(<td key={month} className='sTh'></td>);
        }
      });
      tableData.push(<tr key={item.name} className='sTh'>{dataRow}</tr>);
    });

    return tableData;
  };

  return (
    <table className='sTab'>
      <tbody>{renderTable()}</tbody>
    </table>
  );
};
export default Table;