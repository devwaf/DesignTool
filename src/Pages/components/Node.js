import {Node} from 'butterfly-dag'
import $ from 'jquery';
import {getUUId} from '../../utils/utils'
import { MessageBox,Message } from 'element-ui';
class CustomNode extends Node {
    constructor(props){
        super(props)
        this.titleBox = null
        this.container = null
        this.endpointList = []
        this.data = null
        this.bufferEndpointMap = {}
    }

    // 数据初始化
    init(data){
        let endpointMap =  window.eStore.get("endpointMap")
        console.log(endpointMap);
        if(!endpointMap) return 
        endpointMap = JSON.parse(endpointMap)
        let endpoints = endpointMap[data.id]
        // 新建节点 直接中断
        if(!endpoints) return
        let obj = {}
        endpoints.forEach(point=>{
            obj[point.key] = point
        })
        this.bufferEndpointMap = obj
    }

    draw(data) {

        this.init(data)
        this._onNodeOn()

        this.data = data
        let container = $('<div class= "work-flow-node"></div>')
        .css('top', data.top)
        .css('left', data.left)
        .css('width', data.options.width)
        .css('height', data.options.height)
        .attr('id', data.id)
        .addClass("node_" +  data.options.data.type)
        // console.log(data,"node");
        // 标题
        this._onCreateTitle(container,data)
        this._onCreateOutEndPoint(container,data.options.data)
        // console.log(data.options.data.type);
        if(data.options.data.type == "Geometry"){
            // 不可编辑的属性
            this._onAddNodeAgrs(container,data.options.data)
        }else if(data.options.data.type == "Operation"){
            this._onAddNodeAgrs(container,data.options.data)
        }
        else if(data.options.data.type == "NumberOperation"){
            // 数值运算组件
            this._onAddNodeAgrs(container,data.options.data)
        }
        else{
            // 添加数值组件、属性组件面板  面板可编辑属性
            this._onAddNodeProps(container,data.options.data)
        }
        
        // if(data.options.content&&data.options.content.length>0){
        //     let nodeContent = $(`<div class='node-content'></div>`)
        //     let item = null
        //     data.options.content.forEach(c=>{
        //         item = $(`<div class='node-content-item'>${c}</div>`)
        //         nodeContent.append(item)
        //     })
        //     container.append(nodeContent)
        // }
        
        // container.append(`<i class="el-icon-close node-close-icon"></i>`)
        this.container = container
        return container[0]
    }

    // 创建节点标题 及可编辑标题 关闭按钮
    _onCreateTitle(container,data){
        let icon = {
            // Geometry:"icon-jiheti iconfont",
            // Operation:"icon-yunsuanzujian iconfont",
            // NumberOperation:"icon-shuzhiyunsuanzujian iconfont",
            // Number:"icon-shuzhizujian iconfont",
            // Props:"icon-shuxing iconfont",
        }
        if(data.options.label){
            let _this = this
            let nodeLabel = $(`<div class="node-title">
                <i class="el-icon-close title-icon close-icon"></i>
                <h4 class='node-label'> <i class="${icon[data.options.data.type]}"></i> ${data.options.label}</h4>
            </div>`)
            if(data.options.data.content=="MutNumber"){
                let i = document.createElement("i")
                i = $(i).addClass("title-icon add-icon el-icon-plus")
                nodeLabel.append(i)

                i.on("click",function(evt){
                    _this._onCreatePropsByDialog(container,data)
                })
            }
            container.append(nodeLabel)
            let evtDom = nodeLabel.find('.node-label')
            evtDom.on("dblclick",function(evt) {
                console.log(evtDom.html());
                if ($(evtDom.html()).attr('type') !== 'text'){
                    evtDom.html(`<input style="width:90px" />`)
                    evtDom.find("input").focus().val(data.options.label)
                    evtDom.children().keyup(function(event){
                        if (event.keyCode === 13 || event.keyCode === 27) {
                            data.options.label = evtDom.find("input").focus().val()
                            evtDom.html(`<i class="${icon[data.options.data.type]}"></i>  ${ data.options.label}`)
                            // console.log(data);
                            _this._onEmit("update")
                        }
                    })
                    
                }
            })

            nodeLabel.find(".close-icon").on("click",function(){
                _this._onEmit("delete")
            })

            nodeLabel.find(".add-icon").on("click",function(){

            })
        }
    }

    // 端口属性(Key)检查获取UUID 主要针对历史数据  通过节点Map
    _onGetUUIdBYendPointKey(key){
       let point = this.bufferEndpointMap[key]
       if(point){
           return point.uuid
       }

       return getUUId()
    }

    // 创建输入端点
    _onCreateOutEndPoint(container,data){
        let outMap = {
            Geometry:"G",
            Operation:"G",
            Number:"MV",
            NumberOperation:"V"
        }
        // 数值类型不需要额外添加输出
        if(data.type != "Number"||data.content=="MutNumber"){
            let uuid = this._onGetUUIdBYendPointKey("source")
            container.append(`<div class="outpoint">
                ${outMap[data.type]}<div class="sourceEndPoint butterflie-circle-endpoint" id="${uuid}"> </div>
            </div>`)
            this.endpointList.push({uuid,type:"source",key:"source"})
        }
    }

    // 除数值类型 args(Array) 添加属性节点
    _onAddNodeAgrs(container,data){
        // console.log(Object.keys(data.args));
        Object.keys(data.args).forEach(key=>{
            let uuid = this._onGetUUIdBYendPointKey(key)
            // v.uuid = uuid
            container.append(`<div class="node-item">
                <div class="targetEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
                <div class="prop_content"> <div> ${key} </div> </div>
            </div>`)
            this.endpointList.push({uuid,type:"target",key})
        })
    }

    // 数值类型 value字段（String,Array） 添加 属性节点
    _onAddNodeProps(container,data){
        if(Array.isArray(data.value)){
            data.value.forEach(v=>{
                let uuid = this._onGetUUIdBYendPointKey(v.prop)
                v.uuid = uuid
                container.append(`<div class="node-item">
                    <div class="targetEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
                    <div class="prop_content"> <div> ${v.prop} </div> </div>
                </div>`)
                // <div class="prop_content"> <div> ${v.prop} : ${v.value} </div> </div>
                this.endpointList.push({uuid,type:"target",key:v.prop})
            })
        }else{
            let uuid = this._onGetUUIdBYendPointKey(data.content)
            data.uuid = uuid
            container.append(`<div class="node-item">
                <div class="prop_content"> <div> ${data.content} : ${data.value} </div> </div>
                <div class="sourceEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
            </div>`)
            let point = {uuid,type:"source",key:data.content}
            this.endpointList.push(point)
            this.bufferEndpointMap[data.content] = point
        }
        let nodeItem = container.find(".node-item")
        // console.log(nodeItem);
        this._onEditNodeProp(nodeItem)
    }

    // 动态添加可编辑数据节点
    _onCreatePropsByDialog(container,data){
        let uuid = getUUId()
        // console.log("i evt",evt);
        MessageBox.prompt("请输入属性名称", '属性添加', {
            dangerouslyUseHTMLString:true,
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then(({value}) => {
            let prop = value
            if(!prop || prop.trim()=="")return Message.error("请勿添加空属性名称")
            if(this.bufferEndpointMap.hasOwnProperty(prop)){
                Message.error("请勿添加当前节点重复属性")
                return 
            }

            if(data.options.data.type=="Number"&&data.options.data.content=="MutNumber"){
                data.options.data.value.push({prop,value:0})
            }else if(data.options.data.type=="Geometry"){
                data.options.data.customArgs.push({prop,value:0})
            }
            
            this._onEmit("update")

            

            let nodeItem = $(`<div class="node-item">
                <div class="targetEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
                <div class="prop_content"> <div style="display:flex;align-items: center;"> <span style="flex:1;">${prop}</span> <i class="el-icon-close icon-class"></i>  </div> </div>
            </div>`)
            container.append(nodeItem)

            this.addEndpoint({
                id:uuid,
                dom:document.getElementById(uuid),
                type:"target",
                limitNum: 1
            })
            let point = {uuid,type:"target",key:prop}
            this.endpointList.push(point)
            this.bufferEndpointMap[prop] = point
            this._onEmit("insetEndPoint")

            // 删除属性
            nodeItem.find(".icon-class").on("click",(evt)=>{
                if(data.options.data.type=="Number"&&data.options.data.content=="MutNumber"){
                    data.options.data.value.splice(nodeItem.index()-1)
                }else if(data.options.data.type=="Geometry"){
                    data.options.data.customArgs.splice(nodeItem.index()-1)
                }
                nodeItem.remove()
                this.endpointList = this.endpointList.filter(e=>e.uuid!=uuid)
                this._onEmit("update")
                this._onEmit("insetEndPoint")
            })
        })
        .catch(action => {
            console.log("取消"+action);
        });
    }

    // 可编辑数据节点
    _onEditNodeProp(dom){
        let data = this.data.options.data
        let values = this.data.options.data.value
        let _this = this
        dom.find(".prop_content").on("dblclick",function(evt){
            let index = $(this).index()
            let flag = Array.isArray(values)
            if(flag) return
            evt.stopPropagation()
            const oldNode = $(this);
            const oldNodeText = $(this).text();
            if ($(oldNode.html()).attr('type') !== 'text') {
                oldNode.html(`<input type=number style="width:120px" />`);
                flag ? $(oldNode).find('input').focus().val(values[index].value) : $(oldNode).find('input').focus().val(values) ;
                oldNode.children().keyup(function (event) {
                    if (event.keyCode === 13 || event.keyCode === 27) {
                        
                        if(flag){
                            data.value[index].value =  Number($(this).val())
                        }else{
                            data.value = Number($(this).val())
                        }
                        const oldInputText = flag ? `${values[index].prop} : ${values[index].value}` : `${data.content} : ${data.value}` ;
                        oldNode.html(`<div>${oldInputText}</div>`);
                        _this._onEmit("update")
                    }
                });
            }
       })
    }

    // 发送事件
    _onEmit(text,data){
        let upData = data || this
        let event = ["update","delete","insetEndPoint"]
        if(event.indexOf(text) ==-1) return 
        this.emit("custom.node."+text,upData,this.data)
        // console.log("custom.node."+text,this)
    }

    // 监听node事件
    _onNodeOn(){
        this.on("system.node.move",(data)=>{
            if(data.nodes.length==1){
                this._onEmit('update',data.nodes[0].data)
            }
        })
    }

    mounted() {
        let obj = {}
        this.endpointList.forEach(point=>{
            // obj[point.key] = point
            this.addEndpoint({
                id:point.uuid,
                dom:document.getElementById(point.uuid),
                type:point.type,
                limitNum: point.type == "target"  ? 1 : 10000 
            })
        })
        this.bufferEndpointMap = obj
        this._onEmit("insetEndPoint")
    }
}

export default CustomNode