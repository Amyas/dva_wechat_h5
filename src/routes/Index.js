import React from 'react';
import { connect } from 'dva';
import axios from 'axios';

import { GetQueryString } from '../utils/utils';

@connect(() => ({}))
export default class Index extends React.Component {
  state = {
    isOk: true,
    isGz: Number(window.localStorage.getItem('isGz')),
    openid: window.localStorage.getItem('openid'),
  }
  componentWillMount() {
    const { isGz, openid } = this.state;
    const search = this.props.location.search;
    if (isGz !== 1 || !openid) { // 有参数不存在
      if (search === '') { // search  没有参数
        window.location.href = `http://211.159.149.135:8011/wx/wx/getOpenid?url=${window.location.origin + window.location.pathname}`;
      } else if (search.length) { // search 有参数
        const getIsGz = Number(GetQueryString('is_gz', search));
        const getOpenid = GetQueryString('openid', search);
        if (getIsGz !== 1 || !getOpenid) {
          window.location.href = `http://211.159.149.135:8011/wx/wx/getOpenid?url=${window.location.origin + window.location.pathname}`;
        } else {
          window.localStorage.setItem('isGz', getIsGz);
          window.localStorage.setItem('openid', getOpenid);
          this.setState({
            isGz: Number(window.localStorage.getItem('isGz')),
            openid: window.localStorage.getItem('openid'),
          });
        }
      }
    }
  }
  render() {
    const { isOk, isGz, openid } = this.state;
    if (!isOk) {
      return <div>请联系管理员：参数错误</div>;
    }
    if (isGz !== 1) {
      return <div>请联系管理员：未能关注公众号</div>;
    }
    if (openid === null || openid === undefined) {
      return <div>请联系管理员：未能获取openid</div>;
    }
    return (
      <div>
        <h1>商城首页</h1>
        <button
          onClick={() => {
            axios.post('http://211.159.149.135:8011/wx/wx/getjsapi', {
              url: window.location.href.split('#')[0],
            })
              .then((response) => {
                const wxConfig = response.data.data;
                wx.config(wxConfig);
                wx.ready(() => {
                  [
                    'onMenuShareQQ',
                    'onMenuShareAppMessage',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'onMenuShareTimeline',
                  ].forEach((e) => {
                    wx[e]({
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
        >获取JSAPI</button>
      </div>
    );
  }
}
