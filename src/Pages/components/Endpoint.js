import {Endpoint} from 'butterfly-dag'
import $ from 'jquery';
class CustomEndpoint extends Endpoint {
    /**
    * 锚点挂载后的回调
    */
  mount() {}
  
  /**
    * endpoint的渲染方法
    * @param {obj} data - 节点基本信息 
    * @return {dom} - 返回渲染dom的根节点
    */
  draw(obj) {
    console.log(obj);
    let path = super.draw(obj);
    if(obj.type) $(path).addClass( "endpoint_" + obj.type);
    return path;
  }
  
  /**
    * 拖动锚点时设置连线时linkable的状态回调，可定义linkable样式 
    * (需要设置this.theme.endpoint.linkableHighlight属性才能触发此回调)
    */
  linkable() {}
  
  /**
    * 释放鼠标取消连线时linkable的状态回调，可定义取消线段样式清除
    * (与linkable对应配合使用)
    */
  unLinkable() {}
  
  /**
    * 拖动锚点时设置连线时linkable并且hover到此锚点的状态回调，可定义linkable的hover状态样式 
    * (与linkable对应配合使用)
    */
  hoverLinkable() {}
  
  /**
    * 释放鼠标取消连线时linkable并且hover状态回调，可定义取消线段linkable的hover状态的样式清楚
    * (与hoverLinkable对应配合使用)
    */
  unHoverLinkable() {}
}

export default CustomEndpoint