export default {
  functional: true, // 函数式组件，没有vue 的this，性能提高
  props: {
    to: {
      type: String,
      required: true
    }
  },
  render(h, {props,slots, parent}) {
    const click = () => {
      parent.$router.push(props.to)
    }
    return <a onClick={click}>{slots().default}</a>
  }
}