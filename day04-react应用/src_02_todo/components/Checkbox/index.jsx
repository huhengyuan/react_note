import React, { Component } from 'react'
import { Button, Checkbox } from 'antd';

export default class CheckBox extends Component {
    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //   checked: true,
    //     //   disabled: false,
    //     // };
    // }
    // 初始化状态
    state = {
        checked: true,
        disabled: false,
    }
    toggleChecked = () => {
        this.setState((prevState) => ({
            checked: !prevState.checked,
        }));
    };

    toggleDisable = () => {
        this.setState((prevState) => ({
            disabled: !prevState.disabled,
        }));
    };

    onChange = (e) => {
        console.log('checked = ', e.target.checked);
        this.setState({
            checked: e.target.checked,
        });
    };
    render() {
        const { checked, disabled } = this.state;
        const label = `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`;
        return (
            <div>
                <p
                    style={{
                        marginBottom: '20px',
                    }}
                >
                    <Checkbox checked={checked} disabled={disabled} onChange={this.onChange}>
                        {label}
                    </Checkbox>
                </p>
                <p>
                    <Button type="primary" size="small" onClick={this.toggleChecked}>
                        {!checked ? '选择' : '取消'}
                    </Button>
                    <Button
                        style={{
                            margin: '0 10px',
                        }}
                        type="primary"
                        size="small"
                        onClick={this.toggleDisable}
                    >
                        {!disabled ? '禁用' : '允许'}
                    </Button>
                </p>
            </div>
        )
    }
}
