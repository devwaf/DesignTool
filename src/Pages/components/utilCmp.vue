<template>
    <div class="util-cmp-container">
        <el-button type="primary" circle @click="test" class="el-icon-refresh"></el-button>
        <el-button type="success" class="iconfont icon-shujujianmo" circle round @click="requestBIM"></el-button>
        <el-button type="primary" class="iconfont icon-daoruSimpleJSONwenjianjia" circle round @click="downloadJson"></el-button>
    </div>

</template>

<script>
export default {
    // mounted
    methods:{
        test(){
            this.$emit('click')
        },
        downloadJson(){
            let json = JSON.stringify(this.$store.state.exportJson)
            let file = new File([json],"test.json",{type:"application/json"})
            // let bolb = new Blob(file,"application/json")
            let url = URL.createObjectURL(file)
            let a = document.createElement("a")
            a.href=url
            a.download=(new Date().getTime()) + ".json"
            a.click()
        },
        requestBIM(){
            window.ipcRenderer.send("window-test",JSON.stringify(this.jsonData))
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