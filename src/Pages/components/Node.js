import {Node} from 'butterfly-dag'
import $ from 'jquery';
import {getUUId} from '../../utils/utils'
class CustomNode extends Node {
    constructor(props){
        super(props)
        this.titleBox = null
        this.container = null
        this.endpointList = []
        this.data = null
    }

    draw(data) {
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
        }else if(data.options.data.type == "NumberOperation"){
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
        // this.markEvent()
        // console.log(data);
        return container[0]
    }

    // 创建节点标题 及可编辑标题 关闭按钮
    _onCreateTitle(container,data){ 
        if(data.options.label){
            let _this = this
            let nodeLabel = $(`<div class="node-title">
                <i class="el-icon-close title-icon close-icon"></i>
                <h4 class='node-label'>${data.options.label}</h4>
                <i class="el-icon-plus title-icon add-icon"></i>
            </div>`)
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
                            evtDom.html(`${ data.options.label}`)
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

    _onCreateOutEndPoint(container,data){
        // 数值类型不需要额外添加输出
        if(data.type != "Number"){
            let uuid = getUUId()
            container.append(`<div class="outpoint">
                <div class="sourceEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
            </div>`)
            this.endpointList.push({uuid,type:"source",key:null})
        }
    }

    _onAddNodeAgrs(container,data){
        // console.log(Object.keys(data.args));
        Object.keys(data.args).forEach(key=>{
            let uuid = getUUId()
            // v.uuid = uuid
            container.append(`<div class="node-item">
                <div class="targetEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
                <div class="prop_content"> <div> ${key} </div> </div>
            </div>`)
            this.endpointList.push({uuid,type:"target",key})
        })
    }

    _onAddNodeProps(container,data){
        if(Array.isArray(data.value)){
            data.value.forEach(v=>{
                let uuid = getUUId()
                v.uuid = uuid
                container.append(`<div class="node-item">
                    <div class="targetEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
                    <div class="prop_content"> <div> ${v.prop} </div> </div>
                </div>`)
                // <div class="prop_content"> <div> ${v.prop} : ${v.value} </div> </div>
                this.endpointList.push({uuid,type:"target",key:v.prop})
            })
        }else{
            let uuid = getUUId()
            data.uuid = uuid
            container.append(`<div class="node-item">
                <div class="prop_content"> <div> ${data.content} : ${data.value} </div> </div>
                <div class="sourceEndPoint butterflie-circle-endpoint" id="${uuid}"></div>
            </div>`)
            this.endpointList.push({uuid,type:"source",key:data.content})
        }
        let nodeItem = container.find(".node-item")
        // console.log(nodeItem);
        this._onEditNodeProp(nodeItem)
    }

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

    _onEmit(text){
        let event = ["update","delete","insetEndPoint"]
        if(event.indexOf(text) ==-1) return 
        this.emit("custom.node."+text,this,this.data)
        // console.log("custom.node."+text,this)
    }

    mounted() {
        this.endpointList.forEach(point=>{
            this.addEndpoint({
                id:point.uuid,
                dom:document.getElementById(point.uuid),
                type:point.type,
                limitNum: point.type == "target"  ? 1 : 10000 
            })
        })
        this._onEmit("insetEndPoint")
    }


    markEvent(){
        let events = ["click"]
        events.forEach(event=>{
            this.container.on(event,(evt)=>{
                this.options.label = new Date().getTime().toString(16)
                console.log(this.options);
            })
        })
    }
}

export default CustomNode