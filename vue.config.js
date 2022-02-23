const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
module.exports = {
    lintOnSave: false,
    devServer:{
        port:22001,
        hot:true,
        open:true
    },
    css: {
        extract: IS_PROD,
        requireModuleExtension: true,// 去掉文件名中的 .module
        loaderOptions: {
                // 给 less-loader 传递 Less.js 相关选项
                // less: {
                //     // `globalVars` 定义全局对象，可加入全局变量
                //     globalVars: {
                //         primary: '#333'
                //     }
                // },
                sass:{}
        }
    },
    pluginOptions:{
        electronBuilder:{
            preload: 'src/preload.js',
        }
    }


}