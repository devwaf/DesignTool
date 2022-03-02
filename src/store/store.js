import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
    exportJson:{},
    nodeList:[]
}

const mutations = {
    parseDataToJson(state,_data){
        let obj = {}
        let data = {}
        let jsonData = {}
        this.commit("setPropUuidByEdges",_data)
        let nodeList = state.nodeList
        nodeList.forEach(node=>{
            data = {label:node.content,name:node.label,uuid:node.id}
            if(node.type==="Props"){
                Array.isArray(node.value) ? node.value.forEach(v=>data[v.prop]=v.value) : data.value = node.value
            }else if(node.type ==="Number"){
                if(node.content=="MutNumber"){
                    data.value = node.value.map(v=>v.value)
                }else{
                    data.value = node.value
                }
            }else if(node.type=="NumberOperation"){
                console.log(node);
                data.value = [node.args.A,node.args.B]
            }else if(node.type=="Operation"){
                data = {...data}
                data.value = [node.args.A,node.args.V || node.args.B]
                if( data.args)delete data.args
            }else{
                data = {...data,...node.args}
            }

            if(!obj.hasOwnProperty(node.type)){
                obj[node.type] = [data]
            }else{
                obj[node.type].push(data)
            }
        })
        jsonData = {
            number: [].concat(obj.Number||[]).concat(obj.NumberOperation||[]),
            geometry:[].concat(obj.Geometry||[]).concat(obj.Operation||[]),
        }
        state.exportJson = jsonData
        return jsonData
    },
    setPropUuidByEdges(state,data){
        const nodeMap = {}
        JSON.parse(JSON.stringify(data.nodeList)).forEach(node=>{
            nodeMap[node.id] = node.data
            // 更新最新的label值
            nodeMap[node.id].label = node.label
        })
        const edgeList = data.edgeList
        let endpointMap = data.endpointMap
        // sourceNode,targetNode,   source 开始端点id   ,target 结束端点id
        edgeList.forEach(({sourceNode,targetNode,source,target})=>{
            let targetNodeEndpoints = endpointMap[targetNode]
            let index = targetNodeEndpoints.findIndex(f=>f.uuid == target)
            if(index==-1) return
            let props = targetNodeEndpoints[index]
            switch (nodeMap[targetNode].type) {
                case "NumberOperation":
                    nodeMap[targetNode].args[props.key] = sourceNode
                case "Geometry":
                    nodeMap[targetNode].args[props.key] = sourceNode
                case "Operation":
                    nodeMap[targetNode].args[props.key] = sourceNode
                    break;
                case "Number":
                    index = nodeMap[targetNode].value.findIndex(v=>v.prop==props.key)
                    nodeMap[targetNode].value[index].value = sourceNode
                    break;
                default:
                    break;
            }
        })
        state.nodeList = Object.values(nodeMap)
    }
}




const store = new Vuex.Store({
    state,
    mutations
})

export default store