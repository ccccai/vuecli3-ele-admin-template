<template>
  <div class="table-demo">
    <el-card class="list-content" shadow="hover">
      <template v-if="$route.meta.check">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          :cell-style="{ whiteSpace: 'nowrap'}"
          :header-row-style="{ background: '#EBEEF5'}"
          style="width: 100%"
          class="table-content"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            sortable
            width="50"
          />
          <el-table-column
            v-for="(item,index) in tableHeader"
            :key="index"
            :prop="index"
            sortable
            :label="item"
            align="center"
          />
          <el-table-column
            label="操作"
            width="230"
            align="center"
            class-name="operation"
          >
            <template slot-scope="scope">
              <a v-if="$route.meta.edit" class="item" @click="test(scope.row)">修改</a>
              <a v-if="$route.meta.delete" class="item" @click="test(scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div v-else class="no-data">
        您暂时没有查看的权限
      </div>
    </el-card>
    <!-- 分页 -->
    <el-pagination
      v-if="$route.meta.check"
      :total="total"
      :pager-count="5"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      :current-page="currentPage"
      background
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableLoading: false,
      tableHeader: {
        id: 'ID',
        name: '名字',
        age: '年龄',
        gender: '性别',
        phone: '电话号码'
      },
      tableData: [],

      pageSize: 20,
      currentPage: 1,
      total: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    getData() {
      this.tableLoading = true
      setTimeout(() => {
        this.$request.httpRequest({
          method: 'post',
          url: this.API.GetTableData,
          noLoading: true,
          params: {
            page: this.currentPage,
            limit: this.pageSize
          },
          success: data => {
            console.log(data, data)
            this.tableData = data.data
            this.total = data.totalCount
            this.tableLoading = false
          },
          error: e => {
            this.tableLoading = false
          }
        })
      }, 3000)
    },
    test(row) {
      console.log('tableRow', row)
    }
  }
}
</script>
<style lang="scss">
@import '~@/styles/table/demo';
.table-demo {
  padding: 25px;
}
</style>
