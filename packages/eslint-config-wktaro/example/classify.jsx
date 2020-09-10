import { WKComponent } from '@/wxat-common/utils/platform'
import { Block, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import hoc from '@/hoc/index'
import reportConstants from '../../../sdks/buried/report/report-constants.js'
import navHeightUtil from '../../utils/nav-height-utlil.js'

import Tabbar from '../../components/custom-tabbar/tabbar'
import HoverCart from '../../components/cart/hover-cart/index'
import Classify from '../../components/classify/index'
import './index.scss'
import { connect } from '@tarojs/redux'
import wxAppProxy from '../../utils/wxAppProxy'

const mapStateToProps = (state) => ({
  currentStoreViewVisible: state.base.currentStoreViewVisible,
  globalData: state.globalData,
})

const mapDispatchToProps = (dispatch) => ({})
// @hoc

@connect(mapStateToProps, mapDispatchToProps)
@WKComponent
class ClassifyPage extends Taro.Component {
  state = {
    showClassify: true,
    reportSource: reportConstants.SOURCE_TYPE.classify.key,
    navHeight: 0,
    navBackgroundColor: '',
    __isPageShow: false,
  }

  componentDidMount() {
    this.setState({
      navHeight: navHeightUtil.getTotalNavHeight(),
    })

    wxAppProxy.setNavColor('pages/classify/index', 'wxat-common/pages/classify/index')
    const params = wxAppProxy.getNavColor('wxat-common/pages/classify/index')
    this.setNavColor(params)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { currentStoreViewVisible, globalData } = this.props
    console.log('componentWillReceiveProps(nextProps, nextContext) -> ', nextProps, nextContext)
    if (currentStoreViewVisible !== nextProps.currentStoreViewVisible) {
      this.setState({
        showClassify: nextProps.currentStoreViewVisible,
      })
    } else if (globalData !== nextProps.globalData) {
      this.setState({
        navHeight: navHeightUtil.getTotalNavHeight(),
      })
    }
  }

  componentDidShow() {
    this.setState({
      __isPageShow: true,
    })
  }

  componentDidHide() {
    this.setState({
      __isPageShow: false,
    })
  }

  onReachBottom() {
    console.log('onReachBottom -> ')
    this.classifyCOMPT.current && this.classifyCOMPT.current.onScrollViewReachBottom()
  }

  setNavColor(params) {
    if (params) {
      this.setState({
        navBackgroundColor: params.navBackgroundColor || '#ffffff', // 必写项
      })
    }
  }

  classifyCOMPT = Taro.createRef()

  // config = {
  //   navigationStyle: 'custom',
  //   navigationBarTitleText: '产品分类'
  // }

  render() {
    const { navHeight, navBackgroundColor, reportSource, showClassify, __isPageShow } = this.state
    return (
      // <Block>
      <View data-scoped='wk-wpc-Classify' className="wk-wpc-Classify page">
        {!!showClassify && (
          <Classify
            ref={this.classifyCOMPT}
            navBackgroundColor={navBackgroundColor}
            isQuickBuyOpen={false}
            reportSource={reportSource}
          />
        )}

        <HoverCart isPageShow={__isPageShow}></HoverCart>
      </View>
      // </Block>
    )
  }
}

export default ClassifyPage
