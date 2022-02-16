<template>
  <div class="export-container" :class="isExpand ? 'open' : 'close' ">
      <div class="json-content" v-show="isExpand">
          <VueJsonViewer v-model="jsonData" :expand-depth="5" :expanded="true" />
      </div>
      <div class="operation-btns" v-show="isExpand">
          <el-button size="small" @click.stop="copyJson"> 复 制 </el-button>
          <el-button size="small" @click.stop="exportJson"> 导 出Json </el-button>
          <!-- <el-button size="small" @click.stop="openRequest"> 请 求 </el-button> -->
      </div>
      <i class="icon" :class="isExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click.stop="expandContainer"></i>
      <el-dialog
        title="请求配置"
        :visible.sync="isVisiable"
        :close-on-click-modal="false"
        append-to-body
        width="30%">
        <el-form v-model="requestForm" label-width="100px"> 
            <el-form-item label="请求地址">
                <el-input v-model="requestForm.url" />
            </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="isVisiable = false">取 消</el-button>
            <el-button type="primary" @click="isVisiable = false">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
import VueJsonViewer from 'vue-json-viewer'
export default {
    components:{
        VueJsonViewer
    },
    props:{
        data:{}
    },
    watch:{
        data(nv){
            this.importData = nv
            // this.setJson()
        }
    },
    data() {
        return {
            importData:{},
            isExpand:false,
            isCopy:false,
            jsonData:{
                Geomerty:[],
                Operator:[],
                Var:[]
            },
            isVisiable:false,
            requestForm:{
                url:"xxxx"
            }
        }
    },
    created(){
        this.importData = this.data
        // this.setJson()
    },
    mounted(){
        // 控制全局复制粘贴事件
        document.addEventListener('copy', (event) => {
            if(!this.isCopy)return
            event.clipboardData.setData('text/html', JSON.stringify(this.jsonData));
            this.$message.success("复制成功")
            event.preventDefault();
            this.isCopy = false
        });
    },
    methods: {
        expandContainer(){
            this.isExpand = !this.isExpand
            if(this.isExpand){
                let nodeList = this.setPropUuidByEdges()
                let obj = {}
                let data = {}
                nodeList.forEach(node=>{
                    data = {label:node.content,name:node.label,uuid:node.id}
                    if(node.type==="Props"){
                        Array.isArray(node.value) ? node.value.forEach(v=>data[v.prop]=v.value) : data.value = node.value
                    }else if(node.type ==="Number"){
                        data.value = node.value
                    }else{
                        data = {...data,...node.args}
                    }

                    if(!obj.hasOwnProperty(node.type)){
                        obj[node.type] = [data]
                    }else{
                        obj[node.type].push(data)
                    }
                })
                // console.log(obj);
                this.jsonData = {
                    number: [].concat(obj.Number||[]).concat(obj.NumberOperation||[]),
                    geometry:[].concat(obj.Geometry||[]).concat(obj.Operation||[]),
                    parameter:obj.Props||[]
                }
                // this.setDataByEdges()
                // this.setPropUuidByEdges()
            }else{
                this.jsonData = {}
            }
        },
        // 根据连接线赋值
        setDataByEdges(){
            /**
             * 从基础数值组件开始根据连接线关系进行数据导出
             * 顺序为：数值组件 -> 属性组件 -> 几何体组件
             *                -> 几何体组件
             * 其中数值组件包含 数值运算组件  几何体组件包含 几何运算组件
             */
            // 所有连接线
            const edges = this.$parent._data.edgeList
            const nodeList = this.$parent._data.nodeList
            // 节点连接线端点参数
            let nodeEndpointMap = this.$parent._data.endpointMap
            let endpointMap,index,endpoint,edgeList,numberList = this.jsonData.Number || [],propList=this.jsonData.Props || [],numberOperationList = this.jsonData.NumberOperation || []
            // 数值组件
            numberList.forEach(n=>{
                edgeList = edges.filter(e=> n.id == e.sourceNode)
                edgeList.forEach(edge=>{
                    index = nodeList.findIndex(node=>node.id==edge.targetNode)
                    if(index!=-1){
                        let node = nodeList[index]
                        // console.log(node);
                       index = nodeEndpointMap[edge.targetNode].findIndex(f=>f.uuid == edge.target)
                       let key = nodeEndpointMap[edge.targetNode][index].key
                       if(node.data.args)node.data.args[key] = n.value
                       if(node.data.value){
                           node.data.value.forEach(v=>{if(v.prop==key)v.value=n.value})
                       }
                        // console.log(node);
                    //    console.log(nodeList);
                    }
                })
            })


            // 属性组件
            propList.forEach(p=>{
                edgeList = edges.filter(e=> p.id == e.sourceNode)
                edgeList.forEach(edge=>{
                    index = nodeList.findIndex(node=>node.id==edge.targetNode)
                    if(index!=-1){
                        let node = nodeList[index]
                        // console.log(node);
                       index = nodeEndpointMap[edge.targetNode].findIndex(f=>f.uuid == edge.target)
                       let key = nodeEndpointMap[edge.targetNode][index].key
                       let obj = {}
                       if(Array.isArray(p.value)){
                           p.value.forEach(pv=>obj[pv.prop] = pv.value)
                       }else{
                           obj = p.value
                       }
                       console.log(obj);
                       if(node.data.args)node.data.args[key] = obj
                    //    if(node.data.value){
                    //        node.data.value.forEach(v=>{if(v.prop==key)v.value=n.value})
                    //    }
                        console.log(node);
                    //    console.log(nodeList);
                    }
                })
            })

            // 数值运算组件
            numberOperationList.forEach(no=>{
                console.log(no);
                edgeList = edges.filter(e=> no.id == e.sourceNode)
                edgeList.forEach(edge=>{
                    index = nodeList.findIndex(node=>node.id==edge.targetNode)
                    if(index!=-1){
                        let node = nodeList[index]
                        // console.log(node);
                        index = nodeEndpointMap[edge.targetNode].findIndex(f=>f.uuid == edge.target)
                        let key = nodeEndpointMap[edge.targetNode][index].key
                         console.log(`${no.args.A}${no.alge}${no.args.B}`);
                        let result = eval(`${no.args.A}${no.alge}${no.args.B}`)
                       
                        // if(Array.isArray(p.value)){
                        //     p.value.forEach(pv=>obj[pv.prop] = pv.value)
                        // }else{
                        //     obj = p.value
                        // }
                        console.log(result);

                        if(node.data.args)node.data.args[key] = result
                        if(node.data.value){
                            node.data.value.forEach(v=>{if(v.prop==key)v.value=result})
                        }
                        console.log(node);
                    //    console.log(nodeList);
                    }
                })
            })

            





        },

        setPropUuidByEdges(){
            const nodeMap = {}
            JSON.parse(JSON.stringify(this.$parent._data.nodeList)).forEach(node=>{
                nodeMap[node.id] = node.data
                // 更新最新的label值
                nodeMap[node.id].label = node.label
            })
            const edgeList = this.$parent._data.edgeList
            let endpointMap = this.$parent._data.endpointMap
            // sourceNode,targetNode,   source 开始端点id   ,target 结束端点id
            let reslut = []
            edgeList.forEach(({sourceNode,targetNode,source,target})=>{
                let targetNodeEndpoints = endpointMap[targetNode]
                let index = targetNodeEndpoints.findIndex(f=>f.uuid == target)
                let props = targetNodeEndpoints[index]

                switch (nodeMap[targetNode].type) {
                    case "NumberOperation":
                        nodeMap[targetNode].args[props.key] = sourceNode
                    case "Geometry":
                        nodeMap[targetNode].args[props.key] = sourceNode
                    case "Operation":
                        nodeMap[targetNode].args[props.key] = sourceNode
                        break;
                    case "Props":
                        index = nodeMap[targetNode].value.findIndex(v=>v.prop==props.key)
                        nodeMap[targetNode].value[index].value = sourceNode
                        break;
                    default:
                        break;
                }
            })
            
            return Object.values(nodeMap)
        },


        setJson(){
            let json = {
                Geometry:[],
                Operation:[],
                Var:[]
            }
            this.importData.forEach(d => {
                json[d.data.type].push(d.data)
            });
            this.jsonData = {
                Geomerty:json.Geometry,
                Operator:json.Operation,
                Var:json.Var
            }
        },
        // 复制触发
        copyJson(){
            this.isCopy = true
            document.execCommand("copy",false) 
        },
        exportJson(){
            let file = new File([JSON.stringify(this.jsonData)],"test.json",{type:"application/json"})
            // let bolb = new Blob(file,"application/json")
            let url = URL.createObjectURL(file)
            let a = document.createElement("a")
            a.href=url
            a.download=(new Date().getTime()) + ".json"
            a.click()
            // console.log(file);
        },
        openRequest(){
            this.isVisiable = true
        }
    },
}
</script>

<style lang="scss" scoed>
.export-container{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    transition: height 0.2s,background-color 0.15s;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    &.open{
        height: 90vh;
        background-color: rgba(255,255,255,1);
        z-index: 9;
    }
    &.close{
        height: 35px;
        background-color: transparent;
    }
    .icon{
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
        padding: 2px 20px;
        font-size: 30px;
        color: #3c3a3a;
        border-radius: 4px;
        background-color: rgba(112, 111, 111, 0.5);
        cursor: pointer;
        &:hover{
            color: #fff;
            background-color: #3db37c;
        }
    }
    .json-content{
        height: 100%;
        overflow: auto;
    }
    .operation-btns{
        position: absolute;
        top: 10px;
        right: 20px;
    }
}
</style>