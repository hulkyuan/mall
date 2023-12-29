<template>
    <div class="app-container">

        <div class="overview-layout">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">CPU利用率</div>
                        <div>
                            <ve-line :data="cpu_data" :legend-visible="false" :loading="loading" :data-empty="dataEmpty"
                                :settings="cpuSettings"></ve-line>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">内存利用率</div>
                        <div>
                            <ve-line :data="memory_data" :legend-visible="false" :loading="loading" :data-empty="dataEmpty"
                                :settings="cpuSettings"></ve-line>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">硬盘利用率</div>
                        <div>
                            <ve-line :data="cache_data" :legend-visible="false" :loading="loading" :data-empty="dataEmpty"
                                :settings="cpuSettings"></ve-line>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="overview-layout">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">视频行为分析系统</div>
                        <div style="padding: 20px">
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">后台管理服务</el-col>
                                <el-col :span="12" class="overview-item-value">400</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">流媒体服务</el-col>
                                <el-col :span="12" class="overview-item-value">400</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">视频分析器</el-col>
                                <el-col :span="12" class="overview-item-value">400</el-col>
                            </el-row>

                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">系统信息</div>
                        <div style="padding: 20px">
                            <el-row class="font-medium">
                                <el-col :span="8" class="overview-item-title">运行</el-col>
                                <el-col :span="16" class="overview-item-value">32天22小时11分钟16秒</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="8" class="overview-item-title">CPU</el-col>
                                <el-col :span="16" class="overview-item-value">36.4% / 4</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="8" class="overview-item-title">内存</el-col>
                                <el-col :span="16" class="overview-item-value">47.5% / 7.90GB</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="8" class="overview-item-title">存储</el-col>
                                <el-col :span="16" class="overview-item-value">82.6% / 118.66GB</el-col>
                            </el-row>

                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="out-border">
                        <div class="layout-title">授杈信息</div>
                        <div style="padding: 20px">
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">授杈状态</el-col>
                                <el-col :span="12" class="overview-item-value">未授权</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">授权码生效时间</el-col>
                                <el-col :span="12" class="overview-item-value">36.4% / 4</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">授杈码过期时间</el-col>
                                <el-col :span="12" class="overview-item-value">47.5% / 7.90GB</el-col>
                            </el-row>
                            <el-row class="font-medium">
                                <el-col :span="12" class="overview-item-title">授权码有效时长</el-col>
                                <el-col :span="12" class="overview-item-value">82.6% / 118.66GB</el-col>
                            </el-row>

                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>
  
<script>
import {
    str2Date
} from '@/utils/date';
import img_home_order from '@/assets/images/home_order.png';
import img_home_today_amount from '@/assets/images/home_today_amount.png';
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';


export default {
    name: 'home',
    data() {
        return {

            cpuSettings: {
                labelMap: {
                    "date": '日期',
                    'rate': '使用率',
                },
            },
            cpu_data: {
                columns: ['date', 'rate'],
                rows: []
            },
            memory_data: {
                columns: ['date', 'rate'],
                rows: []
            },
            cache_data: {
                columns: ['date', 'rate'],
                rows: []
            },
            loading: false,
            dataEmpty: false,
            img_home_order,
            img_home_today_amount,
            img_home_yesterday_amount
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            setTimeout(() => {
                var chart_data = {
                    cpu: {
                        rows:
                            [
                                {
                                    date: '2018-11-01',
                                    rate: 10,
                                },
                                {
                                    date: '2018-11-02',
                                    rate: 20,
                                },
                                {
                                    date: '2018-11-03',
                                    rate: 33,
                                },
                                {
                                    date: '2018-11-07',
                                    rate: 20,
                                },
                            ],

                    },
                    memory: {
                        rows: [{
                            date: '2018-11-01',
                            rate: 10,
                        },
                        {
                            date: '2018-11-02',
                            rate: 20,
                        },
                        {
                            date: '2018-11-03',
                            rate: 33,
                        },
                        {
                            date: '2018-11-04',
                            rate: 50,
                        },

                        {
                            date: '2018-11-07',
                            rate: 20,
                        },
                        {
                            date: '2018-11-08',
                            rate: 60,
                        },
                        {
                            date: '2018-11-09',
                            rate: 50,
                        }]
                    },
                    cache: {
                        rows: [{
                            date: '2018-11-01',
                            rate: 10,
                        },
                        {
                            date: '2018-11-02',
                            rate: 20,
                        },
                        {
                            date: '2018-11-03',
                            rate: 33,
                        },

                        {
                            date: '2018-11-07',
                            rate: 20,
                        },
                        {
                            date: '2018-11-09',
                            rate: 50,
                        }]
                    }
                }
                this.cpu_data.rows = chart_data.cpu.rows;
                this.memory_data.rows = chart_data.memory.rows;
                this.cache_data.rows = chart_data.cache.rows;
                this.dataEmpty = false;
                this.loading = false
            }, 1000)
        }
    }
}
</script>
  
<style scoped>
.app-container {
    /* margin-top: 20px; */
    margin-left: 20px;
    margin-right: 20px;
}

.address-layout {}

.total-layout {
    margin-top: 20px;
}

.total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
}

.total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
}

.total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
}

.total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
}

.un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
}

.layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
}

.un-handle-content {
    padding: 20px 40px;
}

.un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
}

.overview-layout {
    margin-top: 20px;
}

.overview-item-value {
    margin-top: 10px;
    font-size: 16px;
    text-align: left;
}

.overview-item-title {
    margin-top: 10px;
    text-align: left;
}

.out-border {
    border: 1px solid #DCDFE6;
}

.statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
}

.mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
}

.address-content {
    padding: 20px;
    font-size: 18px
}
</style>