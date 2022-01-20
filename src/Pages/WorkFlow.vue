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
                  {{ mc.label }}
                </div>
              </li>
            </ul>
        </div>
      </section>
      
    </div>
    <div class="work-flow-canvas" id="work-flow-canvas"></div>
    <div class="work-flow-options">
      <WorkFlowOptions :data="activeNode" @submit="optionsSubmit" />
    </div>
    <ExportCom :data="nodeList" />
  </div>
</template>
<script>
import { Canvas } from "butterfly-dag";
import Node from "./components/Node";
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
      menus: Menus,
      isDrag: false,
      activeIndex: {
        pIndex:-1,
        cIndex:-1
      },
      activeNode:{},
      isDraw:false
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
      });
      canvas.draw({
        nodes: this.nodeList,
        edges: this.edgeList,
        groups: this.groupList,
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
      let pMenu = this.menus[this.activeIndex.pIndex]
      let menu = pMenu.children[this.activeIndex.cIndex];
      let content = []
      let k,id = "node_" + getUUId(),endpoints=[]
      for(k in menu.args){
        content.push(`${k}:${menu.args[k]}`)
      }

      // 判断
      if(pMenu.type === "Geometry"){
          endpoints.push({
            id: "endpoint" + getUUId(),
            orientation: [-1, 0],
            // type:"target"
          })
          endpoints.push({
            id: "endpoint" + getUUId(),
            orientation: [1, 0],
            // type:"source"
          })

      }else if(pMenu.type === "Operation"){
        // 特殊 运算符 放置只有一个target
        if(menu.content !== "Place"){
          endpoints.push({
            id: "endpoint" + getUUId(),
            orientation: [-1, 0],
            type:"target",
            limitNum:1,
          })
        }
        endpoints.push({
          id: "endpoint" + getUUId(),
          orientation: [1, 0],
          type:"source",
          limitNum:1,
        })
      }

      this.nodeList.push({
          // 数据id及节点id保存一致
          id,
          top: liP.top,
          left: liP.left,
          label: menu.label,
          content: content,
          // args:menu.args,
          data:{...menu,type:pMenu.type,id},
          endpoints,
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
      let events = ["system.node.click","system.link.connect","system.links.delete"]
      events.forEach(event=>{
        this.canvas.on(event,(data)=>{
          switch(event){
            case "system.node.click":
              this.nodeClick(data)
              break;
            case "system.link.connect":
              // console.log(data);
              this.linkConnect(data.links[0])
              break;
            case "system.link.delete":
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
      console.log(this.nodeList);
      let node =this.nodeList.find(node=>node.id==data.node.id)
      // console.log(node.data);
      this.activeNode = node.data
    },
    linkConnect(data){
      if(this.isDraw) return
      if(!data) return
      let {sourceNode,targetNode,sourceEndpoint,targetEndpoint} = data
      // 前后节点均为运算组件则直接返回 并删除连接线
      if(sourceNode.options.data.type === targetNode.options.data.type && targetNode.options.data.type  === "Operation"){
        this.canvas.removeEdge(data.id)
        return
      }
      console.log(sourceNode,targetNode,data);
      let flag = null,prop
      if(sourceNode.options.data.type == "Operation"){
        flag = "source"
        prop = "target"

      }else if(targetNode.options.data.type == "Operation"){
        flag = "target"
        prop = "source"
      }
      // 非运算组件不进行下列操作
      if(!flag) return 
      let index = this.nodeList.findIndex(node => node.id == data[flag+"Node"].id)
      this.nodeList[index].data.args[prop] = data[prop+"Node"].id
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
    linkDisconnect(){},
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
      background-color: #3c3a3a;
      .menu-title{
        padding: 6px 2px;
        color: #f1f1f1;
        border-bottom: 1px dotted #8b8888;
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
        padding: 8px 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        text-align: center;
        word-break: break-all;
        color: #3c3a3a;
        background-color: #f1f1f1;
        user-select: none;
        cursor: pointer;
        &:hover {
          color: #3f2f2f;
          background-color: #fff;
        }
        &:last-child {
          margin-bottom: 0;
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
    width: 400px;
    overflow: auto;
    background-color: #3c3a3a;
  }
  .work-flow-canvas {
    position: relative;
    width: calc(100% - 500px);
    background-color: #aaa;
    .work-flow-node {
      width: 150px;
      text-align: center;
      background: #fff;
      vertical-align: middle;
      border-radius: 5px;
      position: absolute;
      background: #3c3a3a;
      text-align: center;
      color: #bfbfbf;
      &.active {
        border: 2px solid #ff8637;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.8);
      }
      .node-label {
        padding: 5px 10px;
        margin: 0;
        color: #fff;
        font-weight: 500;
        font-size: 14px;
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
  }
}
// 锚点颜色
.butterflie-circle-endpoint{
  background-color: #3db37c;
  border-color: #3db37c;
}
.butterflies-link{
  stroke:#3db37c;
  &:hover{
    stroke:#6dd4a4;
  }
}
</style>