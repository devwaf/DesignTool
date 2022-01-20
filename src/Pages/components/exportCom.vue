<template>
  <div class="export-container" :class="isExpand ? 'open' : 'close' ">
      <div class="json-content" v-show="isExpand">
          <VueJsonViewer v-model="jsonData" :expand-depth="5" :expanded="true" />
      </div>
      <div class="operation-btns" v-show="isExpand">
          <el-button size="small" @click.stop="copyJson"> 复 制 </el-button>
          <el-button size="small" @click.stop="exportJson"> 导 出Json </el-button>
          <el-button size="small" @click.stop="openRequest"> 请 求 </el-button>
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
            this.setJson()
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
        this.setJson()
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
        },
        setJson(){
            let json = {
                Geometry:[],
                Operation:[],
                Var:[]
            }
            this.importData.forEach(d => {
                console.log(d.data.type);
                json[d.data.type].push(d.data)
            });
            console.log(json);
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
    z-index: 9;
    width: 100%;
    transition: height 0.2s,background-color 0.15s;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    &.open{
        height: 90vh;
        background-color: rgba(255,255,255,1);
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