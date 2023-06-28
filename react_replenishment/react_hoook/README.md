### 使用hooks理由
    1.高阶组件为了复用，导致代码层级复杂
    2.生命周期的复杂
    3.写成functional组件,无状态组件，因为需要状态，又改成了class,成本高

### useState -- 保存组件状态
    const [state, setstate] = useState(initialState)

#### 函数式组件不存在生命周期，不要将类式组件的生命周期概念搬过来对应！
### useEffect -- 处理副作用（销毁定时器...，模拟生命周期的概念）
    useEffect(() => {
        <!-- effect -->
            return () => {
                <!-- cleanup -->
            }
        }, [依赖的状态；空数组；表示不依赖])
    若是使用了某个变量，而没有声明，等同于撒谎，即使变量发生改变，useEffect也不会再次执行，eslint会产生警告。
### useLayoutEffect -- 同步执行副作用

    二者调用时机不同，useLayoutEffect和原来componentDidMount & componentDidUpdate一致，在react完成dom更新后马上同步调用代码，会阻塞页面渲染。而useEffect会在整个页面渲染完成之后才会调用代码。官方建议优先使用useEffect。
    在实际使用过程中，若是想要避免页面抖动（在useEffect里面修改dom很可能会出现），可以将需要操作的dom的代码放在useLayoutEffect里。在这里进行dom操作，dom的修改会和react做出更改一起被一次性渲染到屏幕上，只有一次回流、重绘的代价。

### useCallback -- 记忆函数
    防止因为组件重新渲染，导致方法被重新黄建，起到缓存作用，只有第二个参数发生变化，才会重新进行声明。
    var handleClick = useCallback(()=>{
        console.log(name)
    }, [name])
    <button onClick = {()=>handleClick()}>hello</button>
    <!-- 只有name发生改变，这个函数才会重新声明 -->
    <!-- 若是传入空数组，那么就是第一次创建后就被缓存，若是name后期发生买了改变，拿到的还是老的name -->
    <!-- 若是不传第二个参数，每次都会重新声明一次，拿到最新的name -->

### useMemo -- 记忆组件
    useCallback 的功能完全可以被 useMemo 替代
    使用useMemo返回一个记忆函数：
        useCallback( fn, inputs)
        useMemo(() => fn, inputs)
    唯一区别：useCallback不会执行第一个参数函数，而是直接返回。useMemo会执行第一个函数并将执行结果返回。
    所以useCalback 常用记忆事件函数，生成记忆后的事件函数并传递给子组件使用。而useMemo更适合经过函数计算得到一个确定的值，比如记忆组件。

### useRef -- 保存引用值
    const swiper = useRef(null)
    <Swiper ref = {swiper}/>
### useReducer 和 useContext -- 减少组件层级
    import React from 'react'
    var GlobalContext= React.createContext()
    // 注意此时的reduecer 返回值是一个对象 {isShow:false,list:[]}
    function App(){
        let [state, dispatch] = useReducer(reducer, {isShow: true, list:[]})
        return <GlobalContext.Provider value={{
            dispatch
        }}>
            <div>
                {
                    state.isShow?
                    <div>选项卡</div>
                    :null
                }
                {props.children}
            <div/>
        </GlobalContext.Provider>
    }
    function Detail(){
        let { dispatch } = useContext(GlobalContext)
        useEffect(() => {
            <!-- 隐藏 -->
            dispatch({
                type: "Hide",
                payload: true
            })
            return () => {
                <!-- 显示 -->
                dispatch({
                    type: "Show",
                    payload: true
                })
            }
        }, [])
        return <div>detail</div>
    }
### 自定义hook
    --当我们想在两个函数之间共享逻辑时，会将其提取到第三个函数中。
    -- 必须use开头？对，按照约定必须遵循。由于无法判断某个函数手包含对其内部hook的调用，react将无法自动检查hook是否违反hook的规则。