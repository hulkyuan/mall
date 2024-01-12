<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>布控管理</span>
            <el-button size="mini" type="primary" class="btn-add" @click="getList()"
                style="margin-left: 20px">刷新</el-button>
            <el-button size="mini" type="primary" class="btn-add" @click="handleAdd()"
                style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
                <!-- <el-table-column label="ID" width="50" align="center">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column> -->
                <el-table-column label="编号" align="center">
                    <template slot-scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column label="视频流" align="center">
                    <template slot-scope="scope">{{ scope.row.videoName }}</template>
                </el-table-column>
                <el-table-column label="算法处理实时流" width="160" align="center">
                    <template slot-scope="scope">{{ scope.row.users }}</template>
                </el-table-column>
                <el-table-column label="算法" width="100" align="center">
                    <template slot-scope="scope">{{ scope.row.baseName + '' + scope.row.actionName }}</template>
                </el-table-column>
                <el-table-column label="计算频率" width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.multiRate }}</template>
                </el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 0">禁用</span>
                        <span v-else-if="scope.row.status == 1">启用</span>
                        <span v-else-if="scope.row.status == 2">已删除</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" width="160" align="center">
                    <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handlePush(scope.$index, scope.row)">
                            加入布控
                        </el-button>
                        <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
                :page-size="listQuery.pageSize" :page-sizes="[10, 15, 20]" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="isEdit ? '编辑布控' : '添加布控'" :visible.sync="dialogVisible" width="70%">
            <el-form :model="algorithm" ref="adminForm" label-width="150px" size="small">
                <el-form-item label="布控编号:">
                    <el-input v-model="algorithm.code" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-form-item label="选择视频流:">
                    <el-select v-model="algorithm.videoId" placeholder="请选择" @change="onVideoChange">
                        <el-option v-for="item in videoList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频信息:">
                    <el-input :disabled="true" v-model="algorithm.video" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-form-item label="音频信息:">
                    <el-input :disabled="true" v-model="algorithm.audio" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-form-item label="播放地址:">
                    <el-input :disabled="true" v-model="algorithm.urls" style="width: 250px" clearable></el-input>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="选择算法:">
                    <el-select v-model="algorithm.baseId" @change="onBaseChange" placeholder="请选择">
                        <el-option v-for="item in algorithmBaseList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择目标:">
                    <el-select v-model="algorithm.baseParams" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="选择行为:">
                    <el-select v-model="algorithm.actionId" @change="onActionChange" placeholder="请选择">
                        <el-option v-for="item in algorithmBehaviorList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item label="选择音频:">
                    <el-select v-model="algorithm.audioId" placeholder="请选择">
                        <el-option v-for="item in audioList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="画框选项">
                    <el-radio-group v-model="algorithm.picType">
                        <el-radio :label="0">成报警视频只保存画框</el-radio>
                        <el-radio :label="1">合成报警视频同时保存画框和不画框</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否推流">
                    <el-radio-group v-model="algorithm.isPush">
                        <el-radio :label="0">算法处理的视频不推流</el-radio>
                        <el-radio :label="1">算法处理的视频推流</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    fetchList,
    create,
    updateAction,
    deleteAction,
    videoList,
    algorithmBaseList,
    algorithmBehaviorList,
    audioList
} from '@/api/core';
import {
    formatDate
} from '@/utils/date';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultAdmin = {
    id: null,
    code: null,
    videoId: null,
    picType: 0,
    isPush: 0,
    baseParams: null,
    baseId: null,
    audioId: null,
    actionId: null,
};
export default {
    name: 'core',
    data() {
        return {
            myAudio: null,
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            videoList: [],
            audioList: [],
            algorithmBaseList: [],
            algorithmBehaviorList: [],
            total: null,
            listLoading: false,
            dialogVisible: false,
            algorithm: Object.assign({}, defaultAdmin),
            isEdit: false,
            allocDialogVisible: false,
            source: null,
            host: 'http://111.229.115.233:8086',
            options: [{
                value: 'person',
                label: 'person'
            }, {
                value: 'car',
                label: 'car'
            }],
        }
    },
    created() {
        this.getList();
    },
    filters: {
        formatDateTime(time) {
            if (time == null || time === '') {
                return 'N/A';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
    },
    methods: {
        onVideoChange(value) {
            const found = this.videoList.find(item => item.id === value);
            this.algorithm.video = found.video;
            this.algorithm.audio = found.audio;
        },
        onBaseChange(value) {
            const found = this.algorithmBaseList.find(item => item.id === value);
            this.algorithm.baseName = found.name;
        },
        onActionChange(value) {
            const found = this.algorithmBehaviorList.find(item => item.id === value);
            this.algorithm.actionName = found.name;
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.algorithm = Object.assign({}, defaultAdmin);
            this.getAllResource();
        },
        handleDelete(index, row) {
            this.$confirm('是否要删除该视频流?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAction(row.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handlePush(index, row) {
            this.source = this.host + row.urls;
            this.$refs.myAudio.play()
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.getAllResource();
            this.isEdit = true;
            this.algorithm = Object.assign({}, row);
        },
        getAllResource() {
            videoList().then(response => {
                this.videoList = response.data;
                const found = this.videoList.find(item => item.id === this.algorithm.audioId);
                this.algorithm.video = found.video;
                this.algorithm.audio = found.audio;
            });
            algorithmBaseList().then(response => {
                this.algorithmBaseList = response.data;
            });
            algorithmBehaviorList().then(response => {
                this.algorithmBehaviorList = response.data;
            });
            audioList().then(response => {
                this.audioList = response.data;
            })
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateAction(this.algorithm.id, this.algorithm).then(response => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                } else {
                    create(this.algorithm).then(response => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    })
                }
            })
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
    }
}
</script>
<style></style>
    