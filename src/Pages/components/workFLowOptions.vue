<template>
    <div class="container">
        <div class="c-header">
            <template v-if="Object.keys(options).length>0">
                <el-input size="small" v-model="options.label" v-if="isEditLabel">
                    <el-button size="success" slot="append" @click.stop="editOptionsLable">保存</el-button>
                </el-input>
                <template v-else>
                    <span>
                        {{options.label}}
                        <i> 【{{options.content}}】 </i>
                    </span>
                    <i class="icon el-icon-edit" @click.stop="editOptionsLable"></i>
                </template>
            </template>
            
            
        </div>
        <div class="c-body">
            <!-- 几何体 -->
            <template v-if="options.type === 'Geometry' ">
                <div class="option-block">
                    <div class="option-title">translate</div>
                    <div class="arg-item">
                        <el-input type="number" size="small" v-model.number="options.translate.x"></el-input>
                        <el-input type="number" size="small" v-model.number="options.translate.y"></el-input>
                        <el-input type="number" size="small" v-model.number="options.translate.z"></el-input>
                    </div>
                </div>
                <div class="option-block">
                    <div class="option-title">rotate</div>
                    <div class="arg-item">
                        <el-input type="number" size="small" v-model.number="options.rotate.x"></el-input>
                        <el-input type="number" size="small" v-model.number="options.rotate.y"></el-input>
                        <el-input type="number" size="small" v-model.number="options.rotate.z"></el-input>
                    </div>
                </div>
                <div class="option-block">
                    <div class="option-title">scale</div>
                    <div class="arg-item">
                        <el-input type="number" size="small" v-model.number="options.scale.x"></el-input>
                        <el-input type="number" size="small" v-model.number="options.scale.y"></el-input>
                        <el-input type="number" size="small" v-model.number="options.scale.z"></el-input>
                    </div>
                </div>
                <div class="option-block">
                    <div class="option-title">color</div>
                    <div class="arg-item">
                        <el-color-picker v-model="options.color" show-alpha></el-color-picker>
                    </div>
                </div>
                <div class="option-block" :key="index" v-for="(arg,index) in args">
                    <div class="option-title">{{arg.label}}</div>
                    <div class="arg-item">
                        <template v-if="typeof arg.value === 'object'">
                        <el-input type="number" size="small" v-model.number="arg.value.x"></el-input>
                        <el-input type="number" size="small" v-model.number="arg.value.y"></el-input>
                        <el-input type="number" size="small" v-model.number="arg.value.z"></el-input>
                        </template>
                        <template v-else>
                            <el-input size="small" v-model="arg.value"></el-input>
                        </template>
                    </div>
                </div>
            </template>
            <!-- 相互运算符 -->
            <template v-else-if="options.type === 'Operation'">
                 <div class="option-block" :key="index" v-for="(arg,index) in args">
                     <span class="option-title">{{arg.label}}</span>
                    <div class="arg-item">
                        {{arg.value || "未设置"}}
                        <!-- <el-input size="small" v-model="args.value"></el-input> -->
                    </div>
                 </div>
            </template>
            <!-- 中间变量 -->
            <template v-else-if="options.type === 'Var'">
                
            </template>
        </div>
        <div class="c-footer">
            <span class="f-item" @click.stop="resetOptions">重 置</span>
            <span class="f-item submit" @click.stop="submit">确 定</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            require:true
        },
    },
    data(){
        return {
            metaData:{}, // 保存第一次进来原生数据
            options:{},
            value:"",
            args:{},
            isFlag:false,
            isChange:false,
            isEditLabel:false, // 控制修改属性label
        }
    },
    watch:{
        data(nv){
            this.isFlag = false
            this.isChange = false
            this.options = nv
            this.metaData = JSON.parse(JSON.stringify(nv))
            // this.args = this.options.args
            this.getAgrs()
            this.isFlag = true
        },
        options(nv){
            if(this.isChange) return
            if(this.isFlag){
                this.isChange = true
            }
        }
    },
    created(){
        this.options = this.data
        this.metaData = JSON.parse(JSON.stringify(this.data))
        this.getAgrs()
    },
    methods: {
        getAgrs(){
            let args = this.options.args
            console.log(args);
            let k
            let arr = []
            for(k in args){
                console.log(k,"----",args[k]);
                arr.push({label:k,value:args[k]})
            }
            this.args = arr
        },
        // 重置
        resetOptions(){
            this.options = JSON.parse(JSON.stringify(this.metaData))
            this.getAgrs()
        },
        // 确定提交
        submit(){
            console.log(this.options);
            this.$emit('submit',this.options)
        },
        editOptionsLable(){
            this.isEditLabel = !this.isEditLabel
        }
    },

}
</script>
<style lang="scss" scoped>
.container{
    height: 100%;
    .c-header{
        height: 46px;
        line-height: 46px;
        text-align: center;
        color: #3db37c;
        border-bottom: 1px solid #ededed;
        box-sizing: border-box;
        .el-input{
            width: 70%;
        }
    }
    .c-body{
        height: calc(100% - 96px);
        padding: 10px;
        overflow: auto;
        color: #fff;
        box-sizing: border-box;
        .option-block{
            display: grid;
            grid-template-columns: 90px auto;
            place-items: center;
            place-content: start;
            margin-bottom: 10px;
        }
        .arg-item{
            display: flex;
            font-size: 15px;
            place-items: center;
            .arg-title{
                text-align: right;
                margin-right: 10px;
            }
            .el-input+.el-input{
                margin-left: 5px;
            }
        }
    }
    .c-footer{
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100% 100%;
        height: 50px;
        user-select: none;
        background-color: #fff;
        .f-item{
            text-align: center;
            font-size: 18px;
            color: #3c3a3a;
            line-height: 50px;
            cursor: pointer;
            &.submit{
                color: #fff;
                background-color: #3db37c;
            }
        }
    }
}
</style>