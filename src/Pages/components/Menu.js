function menuList(){

    // const menus = [
    //     {
    //         label:"几何体",
    //         type:"Geo",
    //         content:"Box",
    //         args:{
    //             height:100,
    //             width:100,
    //             length:100,
    //             origin:{
    //                 x:0,
    //                 y:0,
    //                 z:0
    //             }
    //         }
    //     },
    //     {
    //         label:"自身运算",
    //         type:"SelfOp",
    //         content:"Rotation",
    //         args:{
    //             x:0,
    //             y:0,
    //             z:0
    //         }
    //     },
    //     {
    //         label:"相互运算_copy",
    //         type:"Op",
    //         content:"Copy",
    //         args:{
    //             souceName:"",
    //             targentName:""
    //         }
    //     },
    //     {
    //         label:"相互运算_and",
    //         type:"op",
    //         content:"Union",
    //         args:{
    //             opName1:"",
    //             opName2:"",
    //             targentName:""
    //         }
    //     },
    //     {
    //         label:"中间变量",
    //         type:"variable",
    //         content:"Variable",
    //         args:{}
    //     }
    // ]

    const menus = [
        {
            label:"几何体",
            type:"Geometry",
            children:[
                {
                    label:"圆弧1",
                    content:"Arc1",
                    args:{
                        degree:0
                    },
                    customArgs:[],
                    color:'rgba(255, 255, 255, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                },
                {
                    label:"圆弧2",
                    content:"Arc2",
                    args:{
                        p1:{x:0,y:0,z:0},
                        p2:{x:0,y:0,z:0},
                        p3:{x:0,y:0,z:0}
                    },
                    customArgs:[],
                    color:'rgba(19, 206, 102, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                },
                {
                    label:"cube",
                    content:"Cube",
                    args:{},
                    customArgs:[],
                    color:'rgba(255, 255, 255, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                },
                {
                    label:"二维线段",
                    content:"Line2D",
                    args:{
                        p1:{x:0,y:0,z:0},
                        p2:{x:0,y:0,z:0}
                    },
                    customArgs:[],
                    color:'rgba(255, 255, 255, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                },
                {
                    label:"三维线段",
                    content:"Line3D",
                    args:{
                        p1:{x:0,y:0,z:0},
                        p2:{x:0,y:0,z:0},
                        p3:{x:0,y:0,z:0}
                    },
                    customArgs:[],
                    color:'rgba(255, 255, 255, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                },
                {
                    label:"section",
                    content:"Section",
                    args:{},
                    customArgs:[],
                    color:'rgba(255, 255, 255, 0.8)',
                    translate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    rotate:{
                        x:0,
                        y:0,
                        z:0
                    },
                    scale:{
                        x:1,
                        y:1,
                        z:1
                    }
                }
            ]
        },
        {
            label:"运算组件",
            type:"Operation",
            children:[
                {
                    label:"并集",
                    content:"Union",
                    args:{
                        source:[],
                        target:null
                    },
                    customArgs:[],
                },
                {
                    label:"交集",
                    content:"Intersect",
                    args:{
                        source:[],
                        target:null
                    },
                    customArgs:[],
                },
                {
                    label:"差集",
                    content:"Difference",
                    args:{
                        source:[],
                        target:null
                    },
                    customArgs:[],
                },
                {
                    label:"组合",
                    content:"Combine",
                    args:{
                        source:[],
                        target:null
                    },
                    customArgs:[],
                },
                {
                    label:"放置",
                    content:"Place",
                    args:{
                        target:[]
                    },
                    customArgs:[],
                }
            ]
        },
        {
            label:"中间变量",
            type:"Var",
            children:[
                {
                    label:"中间变量",
                    content:"Var",
                    args:{
                        geometry:[],
                        operation:[]
                    },
                    customArgs:[],
                }
            ]
        }
    ]

    return menus
}

export default menuList()