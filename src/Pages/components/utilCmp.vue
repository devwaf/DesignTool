<template>
    <div class="util-cmp-container">
        <!-- <el-button type="primary" circle @click="test" class="el-icon-refresh"></el-button> -->
        <el-button type="primary" circle @click="setPythonPath" class="el-icon-setting"></el-button>
        <el-button type="success" class="iconfont icon-shujujianmo" circle round @click="requestBIM"></el-button>
        <el-button type="primary" class="iconfont icon-daoruSimpleJSONwenjianjia" circle round @click="downloadJson"></el-button>

        <el-dialog title="解析python路径" :visible.sync="visible" append-to-body :close-on-click-modal="false" width="450px">
            <input  type="file" @change="fileChange" ref="fileInput" v-show="false"/>
            <el-input v-model="pyPath" placeholder="请填写本地的绝对路径">
                <template #append>
                    <i class="el-icon-search" @click.stop="$refs.fileInput.click()" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;display:flex;justify-content: center;align-items: center;cursor:pointer"></i>
                </template>
            </el-input>
            <template #footer>
                <el-button type="primary" @click="setPyPath">确 定</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<script>
export default {
    data() {
        return {
            visible:false,
            pyPath:""
        }
    },
    mounted(){
       this.pyPath = window.eStore.get("pyPath") || ""
    },
    methods:{
        test(){
            this.$emit('click')
        },
        downloadJson(){
            this.$store.commit("parseDataToJson",this.$parent._data)
            let json = JSON.stringify(this.$store.state.exportJson)
            let file = new File([json],"test.json",{type:"application/json"})
            // let bolb = new Blob(file,"application/json")
            let url = URL.createObjectURL(file)
            let a = document.createElement("a")
            a.href=url
            a.download=(new Date().getTime()) + ".bim"
            a.click()
        },
        requestBIM(){
            this.$store.commit("parseDataToJson",this.$parent._data)
            let json = JSON.stringify({...this.$store.state.exportJson,path:this.pyPath})
            window.ipcRenderer.send("window-test",json)
        },
        // 
        setPythonPath(){
            this.visible = true
        },
        setPyPath(){
            if(this.pyPath.trim()===""){
                this.$message.warning("未配置python路径以Python环境变量路径为准")
            }else{
                window.eStore.set("pyPath",this.pyPath)
            }
            this.visible = false
        },
        fileChange(evt){
            let file = evt.target.files[0]
            console.log(file);
            this.pyPath = file.path.replace(/\//g,"")
        }
    }
}
</script>
<style lang="scss" scoped>
.util-cmp-container{
    position: fixed;
    right: 10px;
    bottom: 10px;
    z-index: 999;
}
</style>