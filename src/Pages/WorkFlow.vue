<template>
  <div class="work-flow-container" @mousemove="onMoseMove">
    <div class="work-flow-menu">
      <section class="menu-block">
          <div class="menu-box" :key="pIndex" v-for="(menu, pIndex) in menus">
            <div class="menu-title"> {{menu.label}} </div>
              <ul>
                <li
                  class="menu-li"
                  :key="cIndex"
                  v-for="(mc,cIndex) in menu.children"
                  @mousedown="liOnmouseDown(pIndex,cIndex, $event)"
                  @mouseup="liOnmouseUp"
                >
                  <div>
                    <i :class="iconMap[menu.type]"></i>
                    {{ mc.label }}
                  </div>
                </li>
              </ul>
          </div>
        </section>
    </div>
    <div class="work-flow-canvas" id="work-flow-canvas"></div>
    <!-- <div class="work-flow-options" :class="Object.keys(activeNode).length > 0 ? 'open' : 'close' ">
      <WorkFlowOptions  :data="activeNode" @submit="optionsSubmit" />
    </div> -->
    <ExportCom :data="nodeList" />
  </div>
</template>
<script>
import { Canvas } from "butterfly-dag";
import Node from "./components/Node";
import Endpoint from './components/Endpoint'
import Menus from "./components/Menu";
import $ from "jquery";
import { getUUId } from "@/utils/utils";
import WorkFlowOptions from './components/workFLowOptions.vue'
import ExportCom from './components/exportCom.vue'
export default {
  components: {
    WorkFlowOptions,
    ExportCom
  },
  data() {
    return {
      canvas:null,
      nodeList: [],
      edgeList: [],
      groupList: [],
      endpointMap:{},
      menus: Menus,
      isDrag: false,
      activeIndex: {
        pIndex:-1,
        cIndex:-1
      },
      activeNode:{},
      isDraw:false,
      iconMap:{
          Geometry:"icon-jiheti iconfont",
          Operation:"icon-yunsuanzujian iconfont",
          NumberOperation:"icon-shuzhiyunsuanzujian iconfont",
          Number:"icon-shuzhizujian iconfont",
          Props:"icon-shuxing iconfont",
      }
    };
  },
  created() {},
  mounted() {
    this.initCanvas();
  },
  methods: {
    // 初始化画布
    initCanvas() {
      const canvas = new Canvas({
        root: document.getElementById("work-flow-canvas"),
        zoomable: true, //可缩放(可传)
        moveable: true, //可平移(可传)
        draggable: true, //节点可拖动(可传)
        linkable:true,
        disLinkable:true,
        theme: {
          edge: {
            shapeType: 'AdvancedBezier',
          }
        }
      });
      canvas.draw({
        nodes: this.nodeList,
        edges: this.edgeList,
        groups: this.groupList,
      },()=>{
        // canvas.setGridMode(true, {
        //   isAdsorb: false,         // 是否自动吸附,默认关闭
        //   theme: {
        //     shapeType: 'circle',     // 展示的类型，支持line & circle
        //     gap: 15,               // 网格间隙
        //     background: 'rgba(0, 0, 0, 0.65)',     // 网格背景颜色
        //     circleRadiu: 0.5,        // 圆点半径
        //     circleColor: 'rgba(255, 255, 255, 0.8)'    // 圆点颜色
        //   }
        // });
      });
      this.canvas = canvas
      this.canvasMarkEvent()
    },
    // 重绘画布
    redrawCanvas(){
      if(this.isDraw) return
      this.isDraw = true
      this.canvas.redraw({
        nodes: this.nodeList,
        edges: this.edgeList,
        groups: this.groupList
      },()=>this.isDraw = false)
    },
    // menu按下开启拖拽模式
    liOnmouseDown(pIndex,cIndex) {
      let activeLi = $($(".menu-box")[pIndex]).find("li.menu-li")[cIndex];
      const JL = $(activeLi);
      let w = JL.width();
      let p = JL.position();
      JL.css("width", w);
      JL.css("left", p.left);
      JL.css("top", p.top);
      JL.addClass("drag-li");
      this.isDrag = true;
      this.activeIndex = {
        pIndex,cIndex
      }
    },
    // menu抬起关闭拖拽模式
    liOnmouseUp(evt) {
      let activeLi = $($(".menu-box")[this.activeIndex.pIndex]).find("li.menu-li")[this.activeIndex.cIndex];
      this.getIsInCanvas(activeLi);
      $(activeLi).removeAttr("style");
      $(activeLi).removeClass("drag-li");
      this.isDrag = false;
      this.activeIndex = {pIndex:-1,cIndex:-1};
    },
    // 判断移动的元素在区间内在区间内添加节点
    getIsInCanvas(activeLi) {
      const canvasContent = $("#work-flow-canvas");
      let liP = $(activeLi).offset();
      let cP = canvasContent.offset();
      if (
        liP.left >= cP.left &&
        liP.left <= canvasContent.innerWidth() + cP.left
      ) {
        this.addWorkNode(liP)
      }
    },
    // 添加工作流节点 dom信息
    addWorkNode(liP){
      let pMenu = JSON.parse(JSON.stringify(this.menus[this.activeIndex.pIndex]))
      let menu =JSON.parse(JSON.stringify(pMenu.children[this.activeIndex.cIndex]));
      let content = []
      let k,id = getUUId(),endpoints=[]
      for(k in menu.args){
        content.push(`${k}:${menu.args[k]}`)
      }

      // 判断
      // if(pMenu.type === "Geometry"){
      //     endpoints.push({
      //       id: getUUId(),
      //       orientation: [-1, 0],
      //       // type:"target"
      //     })
      //     endpoints.push({
      //       id: getUUId(),
      //       orientation: [1, 0],
      //       // type:"source"
      //     })

      // }else if(pMenu.type === "Operation"){
      //   // 特殊 运算符 放置只有一个target
      //   if(menu.content !== "Place"){
      //     endpoints.push({
      //       id: getUUId(),
      //       orientation: [-1, 0],
      //       type:"target",
      //       limitNum:2,
      //       Class:Endpoint
      //     })
      //   }
      //   endpoints.push({
      //     id: getUUId(),
      //     orientation: [1, 0],
      //     type:"source",
      //     limitNum:1,
      //     Class:Endpoint
      //   })
      // }
      // console.log(liP.top,liP.left);
      this.nodeList.push({
          // 数据id及节点id保存一致
          id,
          top: liP.top,
          left: liP.left - 200,  // 减去左侧菜单200的偏移量
          label: menu.label,
          content: content,
          // args:menu.args,
          data:{...menu,type:pMenu.type,id},
          // endpoints,
          Class: Node,
        });
      this.canvas.addNode(this.nodeList[this.nodeList.length-1])
      // console.log(this.nodeList);
    },
    // 全局鼠标移动事件
    onMoseMove(evt) {
      if (!this.isDrag) return;
      let activeLi = $($(".menu-box")[this.activeIndex.pIndex]).find("li.menu-li")[this.activeIndex.cIndex];
      const JL = $(activeLi);
      JL.css("left", evt.x);
      JL.css("top", evt.y);
    },
    canvasMarkEvent(){
      let events = ["system.node.click","system.link.connect","system.links.delete","system.endpoint.limit","custom.node.delete","custom.node.update","custom.node.insetEndPoint"]
      events.forEach(event=>{
        this.canvas.on(event,(data)=>{
          switch(event){
            // case "system.node.click":
            //   this.nodeClick(data)
            //   break;
            case "custom.node.update":
              console.log(data);
              let index = this.nodeList.findIndex(node=>node.id == data.id)
              this.nodeList[index].label = data.options.label
              this.nodeList[index].data = data.options.data
              break;
            case "custom.node.insetEndPoint":
              // console.log(data);
              this.endpointMap[data.id] = data.endpointList
              break;
            case "custom.node.delete":
              this.nodeDelete(data)
              break;
            case "system.link.connect":
              // console.log(data);
              this.linkConnect(data.links[0])
              break;
            case "system.links.delete":
              // console.log(data);
              this.linkDisconnect(data.links[0])
              break;
          }
          // console.log(data,event);
          // console.log(this.canvas);
        })
      })
    },
    // 点击节点
    nodeClick(data){
      console.log(data);
      // console.log(this.nodeList);
      let node =this.nodeList.find(node=>node.id==data.node.id)
      // console.log(node.data);
      this.activeNode = node && node.data
    },
    // 删除节点
    nodeDelete(data){
      this.nodeList = this.nodeList.filter(n=>n.id!=data.id)
      this.canvas.removeNode(data.id)
      console.log(this.nodeList);
      // let removeEdges = this.edgeList.filter(e=> (e.sourceNode == data.id || e.targetNode == data.id) )
      this.edgeList = this.edgeList.filter(e=> (e.sourceNode != data.id && e.targetNode != data.id) )
      delete this.endpointMap[data.id]
      console.log(this.endpointMap);
      // console.log(removeEdges,this.edgeList,data.id);
      // this.removeEdges.forEach(edge=>{

      //   if(edge.sourceNode == data.id){

      //   }else if(edge.targetNode == data.id){

      //   }
         
      // })
    },
    linkConnect(data){
      if(this.isDraw) return
      if(!data) return
      let {sourceNode,targetNode,sourceEndpoint,targetEndpoint} = data

      /**
       * 当几何运算组件接入时候
       * 数值组件及数值运算组件不能直接接入
       */
      let flag
      if(targetNode.data.options.data.type === "Operation"){
        flag = ["Operation","Geometry"].includes(sourceNode.data.options.data.type)
        if(!flag){
          this.$message.warning("请接入几何、几何运算组件")
          this.canvas.removeEdge(data.id)
          return
        }
      }else if(targetNode.data.options.data.type === "Geometry"){
        flag = sourceNode.data.options.data.type == "Operation"
        if(flag){
          this.$message.warning("请接入几何运算组件")
          this.canvas.removeEdge(data.id)
        }
      }

      flag = ["NumberOperation","Props"].includes(targetNode.data.options.data.type)
      if(flag){
        flag = ["NumberOperation","Number"].includes(sourceNode.data.options.data.type)
        if(!flag){
          this.$message.warning("请接入几何组件")
          this.canvas.removeEdge(data.id)
          return
        }
      }

      // 前后节点均为运算组件则直接返回 并删除连接线
      // if(sourceNode.options.data.type === targetNode.options.data.type && targetNode.options.data.type  === "Operation"){
      //   this.canvas.removeEdge(data.id)
      //   return
      // }else if(sourceNode.options.data.type === "Geometry" &&  targetNode.options.data.type === "Var"){
      //   this.canvas.removeEdge(data.id)
      //   return
      // }
 

      // console.log(sourceNode.options.data.type,targetNode.options.data.type);
      // // 中间变量操作
      // if(targetNode.options.data.type == "Var"){
      //   let node = this.nodeList.find(n=>n.data.id == sourceNode.id)
      //   let index = this.nodeList.findIndex(n=>n.data.id == targetNode.id)
      //   let args = this.nodeList[index].data.args
      //   // console.log(args);
      //   // console.log(node);
      //   if(sourceNode.options.data.type == "Operation"){
      //     args.geometry = args.geometry.concat(node.data.args.source)
      //     args.operation.push(sourceNode.id)

      //   }else if(sourceNode.options.data.type == "Geometry"){
      //     args.geometry.push(node.data.id)

      //   }else if(sourceNode.options.data.type == "Var"){
      //     args.geometry = args.geometry.concat(node.data.args.geometry)
      //     args.operation = args.operation.concat(sourceNode.options.data.operation)

      //   }

      // }


      // 运算符操作
      // let flag = null,prop
      // if(sourceNode.options.data.type == "Operation"){
      //   flag = "source"
      //   prop = "target"

      // }else if(targetNode.options.data.type == "Operation"){
      //   flag = "target"
      //   prop = "source"
      // }
      // // 非运算组件不进行下列操作
      // if(!flag) return 
      // let index = this.nodeList.findIndex(node => node.id == data[flag+"Node"].id)
      // // source 输入为 多进 输出为唯一
      // if(Array.isArray(this.nodeList[index].data.args[prop])){
      //    this.nodeList[index].data.args[prop].push(data[prop+"Node"].id)
      // }else{
      //   this.nodeList[index].data.args[prop] = data[prop+"Node"].id
      // }
      // 保存连接线
      this.edgeList.push({
        source: sourceEndpoint.id,
        target: targetEndpoint.id,
        sourceNode: sourceNode.id,
        targetNode: targetNode.id,
        type: 'endpoint'
      })
      // this.redrawCanvas()
    },
    linkDisconnect(data){
      /**
       * sourceNode 开始节点
       * targetNode 结束节点
       */
      let {sourceNode,targetNode} = data
      
      // console.log(sourceNode,"sourceNode");
      // console.log(targetNode,"targetNode");
      this.edgeList = this.edgeList.filter(edge=>{
        return !(edge.sourceNode == sourceNode.id && edge.targetNode ==  targetNode.id)
      })
      // console.log(this.edgeList);
      // switch (targetNode.options.data.type) {
      //   case "Operation":
      //     let index = this.nodeList.findIndex(node=> node.id == targetNode.id)
      //     this.nodeList[index].data.args.source = this.nodeList[index].data.args.source.filter(s=>s!=sourceNode.id) 
      //     break;
      
      //   case "Var":
          
      //     break;
      // }




      // if(targetNode.options.data.type === "Operation"){


      // }else if(sourceNode.options.data.type === "Operation"){
      //   let index = this.nodeList.findIndex(node=> node.id == sourceNode.id)
      //   console.log(this.nodeList[index]);
      //   this.nodeList[index].data.args.target = null
      // }
    },
    // 属性面板
    optionsSubmit(data){

    }
  },
};
</script>
<style lang="scss">
@import url("./butterflyDag.scss");
.work-flow-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  .work-flow-menu {
    width: 200px;
    .menu-block{
      width: 200px;
      height: 100%;
      padding: 10px 0;
      background-color: #1D2F37;
      overflow: auto;
      &::-webkit-scrollbar{
        display: none;
      }
      .menu-title{
        // padding: 6px 2px;
        color: #B7C5FF;
        // border-bottom: 1px dotted #8b8888;
        user-select: none;
      }
    }
    ul {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 10px 10px 15px;
      list-style: none;
      overflow: auto;
      box-sizing: border-box;
      li {
        padding: 11px 16px;
        margin-bottom: 10px;
        // border-radius: 4px;
        text-align: center;
        word-break: break-all;
        color: #B7C5FF;
        background-color: rgba(99, 130, 254, 0.39);
        user-select: none;
        cursor: pointer;
        &>div{
          display: flex;
          align-items: center;
        }
        &:hover {
          color: #3f2f2f;
          background-color: #fff;
        }
        &:last-child {
          margin-bottom: 0;
        }
        .iconfont{
          margin-right: 5px;
        }
      }
      .drag-li {
        position: absolute;
        z-index: 99;
        transform: translate(-50%, -50%);
      }
    }
  }
  .work-flow-options {
    transition: width 0.2s linear;
    overflow: auto;
    background-color: #3c3a3a;
    &.open{
      width: 400px;
    }
    &.close{
      width: 0px;
      overflow: hidden;
    }
  }
  .work-flow-canvas {
    position: relative;
    // width: calc(100% - 500px);
    flex: 1;
    background-color: #263840;
  }
}
// 锚点颜色
.butterflie-circle-endpoint{
  width: 8px;
  height: 8px;
  // background-color: #3db37c;
  // border-color: #3db37c;
  cursor: move;
  &.endpoint_source{
    background-color: transparent;
    border-color: #FFFFFF;
  }
  &.endpoint_target{
    background: rgba(255, 255, 255, 0.39);
    // border-color: #409EFF;
  }
}
.butterflies-link{
  stroke:rgba(255, 255, 255, 0.5);
  &:hover{
    stroke:#6dd4a4;
  }
}
// 节点
.work-flow-node {
  padding-bottom: 10px;
  width: 150px;
  text-align: center;
  background: #fff;
  vertical-align: middle;
  border-radius: 5px;
  position: absolute;
  background: linear-gradient(180deg, rgba($color: #7B39FF, $alpha: .3) 0%, rgba($color: #925EFF, $alpha: .3) 63%, rgba($color: #C1A2FF, $alpha: .3) 100%);
  box-shadow: 0px 8px 8px #19143B;
  text-align: center;
  color: #fff;
  cursor: pointer;
  &.active {
    border: 2px solid #ff8637;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.8);
  }
  &.node_Geometry{
    background: linear-gradient(180deg, rgba($color: #6382FE, $alpha: .3) 0%, rgba($color: #A5B6FC, $alpha: .3) 63%, rgba($color: #D6DEFF, $alpha: .3) 100%);
    box-shadow: 0px 8px 8px #19143B;
    .node-title::after{
      background-image: url(../assets/images/Geometry.png);
    }
  }
  &.node_Operation{
    background: linear-gradient(180deg, rgba($color: #363737, $alpha: .3) 0%, rgba($color: #8F8F8F, $alpha: .3) 63%, rgba($color: #E6E6E6, $alpha: .3) 100%);
    box-shadow: 0px 8px 8px #132734;
    .node-title::after{
      background-image: url(../assets/images/Operation.png);
    }
  }
  &.node_Props{
    background: linear-gradient(180deg, rgba($color: #00C78A, $alpha: .3) 0%, rgba($color: #56FECB, $alpha: .3) 63%, rgba($color: #C2F9E9, $alpha: .3) 100%);
    .node-title::after{
      background-image: url(../assets/images/Props.png);
    }
  }
  &.node_NumberOperation{
    background: linear-gradient(180deg, rgba($color: #0099FF, $alpha: .3) 0%, rgba($color: #52B9FE, $alpha: .3) 63%, rgba($color: #B9E0FB, $alpha: .3) 100%);
    box-shadow: 0px 8px 8px #132734;
    .node-title::after{
      background-image: url(../assets/images/NumberOperation.png);
    }
  }
  .outpoint{
    padding-top: 10px;
    height: 10px;
    display: flex;
    justify-content: flex-end;
    padding-right: 18px;
    align-items: center;
  }
  .sourceEndPoint{
    right: 0;
    background: rgba(255, 255, 255, 0.39);
    opacity: 0.5;
  }
  .targetEndPoint{
    border-color: #fff;
    opacity: 0.8;
  }
  .node-title{
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    &::after{
      content: "";
      display: block;
      background-image: url(../assets/images/default.png);
      background-size: 100% 100%;
      background-position: center;
      width: 100%;
      height: 150%;
      position: absolute;
      z-index: -1;
      top: -13px;
      left: 0;
    }
    .node-label{
      flex: 1;
      display: flex;
      align-items: center;
      .iconfont{
        margin-right: 2px;
      }
    }
    .title-icon{
      padding: 0 10px;
      &:hover{
        color: #1ce286;
      }
    }
  }
  .node-label {
    padding: 10px 10px;
    margin: 0;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
  }
  .node-item{
    display: flex;
    align-items: center;
    padding: 2px 0;
    .prop_content{
      flex: 1;
    }
  }
  .node-content {
    padding: 10px 15px;
    border-top: 1px solid #f9f9f9;
    .node-content-item {
      margin-bottom: 5px;
      color: #bfbfbf;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>