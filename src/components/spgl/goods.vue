<template>
    <div class="splb">
        <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
              <el-button type="primary">添加商品</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            input:'',
        };
    },
    methods: {},
    components: {},
};
</script>

<style scoped lang="scss">
.splb {
    width: 100%;
    height: 100%;
    padding: 10px 20px 20px 20px;
    background: white;
    box-sizing: border-box;
}
//搜索框
.el-select .el-input {
    width: 130px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
.input-with-select{
    width:345px;
    margin-right: 21px;
}
</style>
