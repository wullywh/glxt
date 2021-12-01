<template>
    <div class="main">
        <el-button type="primary">添加分类</el-button>
        <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="cat_id"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="cat_name" label="分类名称"></el-table-column>
            <el-table-column label="是否有效">
                <i class="el-icon-success"></i>
            </el-table-column>
            <el-table-column
                prop="cat_level"
                label="标签"
                :filters="[{ text: '一级', value: '一级' }, { text: '二级', value: '二级' }, { text: '三级', value: '三级' }]"
                :filter-method="filterTag"
                filter-placement="bottom-end"
            >
                <template slot-scope="scope">
                    <!-- 判断分级 -->
                    <el-tag
                        type="primary"
                        v-if="scope.row.cat_level === 0"
                    >{{ what_level(scope.row.cat_level) }}</el-tag>
                    <el-tag
                        type="success"
                        v-else-if="scope.row.cat_level === 1"
                    >{{ what_level(scope.row.cat_level) }}</el-tag>
                    <el-tag type="warning" v-else>{{ what_level(scope.row.cat_level) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 修改弹窗 -->
        <el-dialog title="商品分类" :visible.sync="dialogFormVisible">
            <el-form :model="data_">
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                    <el-input v-model="data_.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品父类" :label-width="formLabelWidth">
                    <el-input v-model="data_.cat_pid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品等级" :label-width="formLabelWidth">
                    <el-input v-model="data_.cat_level" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeover">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import http from '../http/index'
export default {
    props: {

    },
    data() {
        return {
            tableData: [],
            // 控制弹窗是否显示
            dialogFormVisible: false,
            formLabelWidth: '120px',
            // 修改获取的数据
            data_: {
                cat_id: 0,
                cat_name: "",
                cat_pid: 0,
                cat_level: 0
            },
        };
    },
    methods: {
        indexMethod(index) {
            return index + 1;
        },
        // 编辑分类
        handleEdit(index, row) {
            console.log(index, row);
            this.dialogFormVisible = true
            this.data_.cat_id = row.cat_id
            this.data_.cat_name = row.cat_name
            this.data_.cat_pid = row.cat_pid
            this.data_.cat_level = row.cat_level
            http({
                url: `/categories/${this.data_.cat_id}`,
            }).then((res) => {
                console.log(res)
            })
        },
        changeover() {
            http({
                url: `/categories/${this.data_.cat_id}`,
                method: 'put',
                data: {
                    "cat_id": this.data_.cat_id,
                    "cat_name": this.data_.cat_name,
                    "cat_pid": this.data_.cat_pid,
                    "cat_level": this.data_.cat_level
                }
            }).then((res) => {
                console.log(res)
                http({
                    url: '/categories'
                }).then((res) => {
                    this.tableData = res.data
                    console.log(res.data);
                })
            })
            this.dialogFormVisible = false
        },
        // 删除分类
        handleDelete(index, row) {
            console.log(index, row);
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                http({
                    url: `/categories/${row.cat_id}`,
                    method: 'delete'
                }).then((res) => {
                    console.log(res)
                    http({
                        url: '/categories'
                    }).then((res) => {
                        this.tableData = res.data
                        console.log(res.data);
                    })
                })
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        what_level(v) {
            // console.log(v);
            if (v === 0) {
                return "一级"
            } else if (v === 1) {
                return "二级"
            } else {
                return "三级"
            }
        }
    },
    mounted() {
        http({
            url: '/categories'
        }).then((res) => {
            this.tableData = res.data
            console.log(res.data);
        })
    },
    computed: {

    },
};
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    flex: 1;
    padding: 10px 20px 20px 20px;
    background: white;
    box-sizing: border-box;
}
.el-button--primary {
    margin-bottom: 10px;
}
.el-icon-success {
    font-size: 20px;
    color: #90ee90;
}
</style>
