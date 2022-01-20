import {Node} from 'butterfly-dag'
import $ from 'jquery';
class CustomNode extends Node {
    constructor(props){
        super(props)
        this.titleBox = null
        this.container = null
    }

    mounted() {
    }

    draw(data) {
        let container = $('<div class= "work-flow-node"></div>')
        .css('top', data.top)
        .css('left', data.left)
        .css('width', data.options.width)
        .css('height', data.options.height)
        .attr('id', data.id);
        console.log(data,"node");
        // 标题
        if(data.options.label){
            let nodeLabel = $(`<h4 class='node-label'>${data.options.label}</h4>`)
            container.append(nodeLabel)
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
        this.container = container
        // this.markEvent()
        return container[0]
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