// React 没有提供

export function Foo() {
  const [count, setState] = useState()
  useEffect(() => {
    console.log(count)
  }, [])

  return <div>helo {!!this.props.visible && <div>show</div>}</div>
}

export @hoc class Bar {
  handleClick() {}
  render() {
    return (
      this.props.a == 0 && (
        <div onClick={this.handleClick.bind(this)}>
          {this.props.list.map((i) => {
            // 没有提供 key
            return (
              <div>
                {i.map((j) => (
                  // 这种 key 应该避免
                  <div key="id">{j}</div>
                ))}
              </div>
            )
          })}
        </div>
      )
    )
  }
}
