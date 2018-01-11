import React from 'react';
import { connect } from 'dva';
import axios from 'axios';

import { GetQueryString } from '../utils/utils';

@connect(() => ({}))
export default class Index extends React.Component {
  state = {}
  componentWillMount() {
    const search = this.props.location.search;
    const openid = window.localStorage.getItem('openid');
    const getCode = GetQueryString('code', search);
    if (!openid && !getCode) {
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx232e496dad0fbb40&redirect_uri=${encodeURIComponent('http://md.amyas.cn')}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
    } else if (getCode) {
      axios.get('http://www.amyas.cn/wx/wx/userInfo', {
        params: {
          code: getCode,
        },
      }).then((response) => {
        const data = response.data.data;
        window.localStorage.setItem('openid', data.openid);
        window.localStorage.setItem('code', getCode);
        window.history.back();
      });
    }
  }
  render() {
    return (
      <div>
        <h1>商城首页</h1>
        <button
          onClick={() => {
            window.localStorage.clear();
            alert('清除成功');
          }}
        >清除localStorage</button>
        <button
          onClick={() => {
            const openid = window.localStorage.getItem('openid');
            const code = window.localStorage.getItem('code');
            alert(`openid:${openid},code:${code}`);
          }}
        >获取localStorage</button>
        <button
          onClick={() => {
            axios.post('http://211.159.149.135:8011/wx/wx/getjsapi', {
              url: window.location.href.split('#')[0],
            })
              .then((response) => {
                const wxConfig = response.data.data;
                window.wx.config(wxConfig);
                window.wx.ready(() => {
                  [
                    'onMenuShareQQ',
                    'onMenuShareAppMessage',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'onMenuShareTimeline',
                  ].forEach((e) => {
                    window.wx[e]({
                      title: '分享自定义标题',
                      link: 'http://md.amyas.cn/',
                      imgUrl: 'https://www.baidu.com/img/bd_logo1.png',
                      desc: '分享自定义简介',
                      success() {
                        alert('分享成功！');
                      },
                      cancel() {
                        alert('分享失败！');
                      },
                    });
                  });
                });
              });
          }}
        >1.获取JSAPI</button>
        <button
          onClick={() => {
            const params = {
              openid: window.localStorage.getItem('openid'),
              total_fee: 0.01,
              goods: JSON.stringify([{
                id: 7,
                attr: JSON.stringify([{ type: 'radio', classify: '口味', list: ['微辣'] }, { type: 'check', classify: '特殊需求', list: ['不要香菜', '不要葱花'] }]),
              }]),
              content: '老板！！！上餐了！！！！！！！',
            };
            axios.get('http://211.159.149.135:8011/wx/wx/getPay', { params })
              .then((response) => {
                const data = response.data.data;
                data.timestamp = data.timeStamp.toString();
                delete data.timeStamp;
                window.wx.ready(() => {
                  window.wx.chooseWXPay({
                    timestamp: data.timestamp,
                    // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: data.paySign, // 支付签名
                    success(res) {
                      // 支付成功后的回调函数
                      alert(JSON.stringify(res));
                    },
                    cancel(err) {
                      alert(JSON.stringify(err));
                    },
                  });
                });
              });
          }}
        >发起支付请求</button>
      </div>
    );
  }
}
