<template>
  <div class="md-layout">
    <div class="md-layout-item" style="margin: 20px">
      <div @click="addSource" style="width: 50%">
        <md-card style="background-color: #32a3ce">
          <md-card-header class="md-card-header-icon">
            <div class="card-icon" style="background-color: white">
              <md-icon class="md-size-2x" style="color: #32a3ce"
                >add_circle_outline</md-icon
              >
            </div>
            <h4
              class="title md-toolbar-section-end"
              style="color: white; margin-top: 40px; margin-bottom: 20px"
            >
              เพิ่มแหล่งข้อมูล
            </h4>
          </md-card-header>

          <md-card-actions>
            <p style="color: white">
              <md-icon style="color: white">add_circle_outline</md-icon>
              คลิกเพื่อเพิ่มแหล่งข้อมูล
            </p>
          </md-card-actions>
        </md-card>
      </div>
      <md-card>
        <md-card-header class="md-card-header-icon">
          <div class="card-icon" style="background-color: #3177ce">
            <md-icon class="md-size-2x">account_balance</md-icon>
          </div>
          <h4 class="title" style="color: #3177ce">ตารางแสดงแหล่งข้อมูล</h4>
        </md-card-header>
        <md-card-content>
          <md-table
            :value="queriedData"
            table-header-color="blue"
            md-sort.sync="name"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="customSort"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar>
              <!-- <p>แสดง</p> -->
              <md-field style="width: 100px">
                <label for="pages">Per page</label>
                <md-select v-model="pagination.perPage" name="pages">
                  <md-option
                    v-for="item in pagination.perPageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    {{ item }}
                  </md-option>
                </md-select>
              </md-field>
              <!-- <p>รายการ</p> -->
              <md-field>
                <label>ค้นหา:</label>
                <md-input
                  class="mb-3"
                  clearable
                  style="width: 200px"
                  placeholder="ค้นหาในตาราง"
                  v-model="searchQuery"
                />
              </md-field>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell
                md-label="ชื่อของแหล่งข้อมูล"
                md-sort-by="name"
                style="width: 40%"
                >{{
                  item.name.length > 30
                    ? item.name.substr(0, 30) + "..."
                    : item.name
                }}</md-table-cell
              >
              <md-table-cell
                md-label="URL"
                md-sort-by="url"
                style="width: 40%"
                >{{
                  item.url.length > 30
                    ? item.url.substr(0, 30) + "..."
                    : item.url
                }}</md-table-cell
              >
              <md-table-cell
                md-label="Method"
                md-sort-by="method"
                style="width: 5%"
                >{{ item.method }}</md-table-cell
              >
              <md-table-cell md-label="ดำเนินการ" style="width: 15%">
                <md-button
                  class="md-icon-button md-warning"
                  @click="editSource(item._id)"
                  ><md-icon>edit</md-icon></md-button
                >
                <md-button
                  class="md-icon-button md-danger"
                  style="margin-left: 5px"
                  @click="removeSource(item)"
                  ><md-icon>close</md-icon></md-button
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <div>
            <p class="card-category">
              Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
            </p>
          </div>
          <pagination
            class="pagination-no-border pagination-success"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          />
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import { Pagination } from "@/components";
import Fuse from "fuse.js";
import Swal from "sweetalert2";
export default {
  components: {
    Pagination,
  },
  computed: {
    queriedData() {
      let result = this.sourceList;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.sourceList.length;
    },
  },
  watch: {
    searchQuery(value) {
      let result = this.sourceList;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    },
  },
  data() {
    return {
      sourceList: [],
      searchQuery: "",
      searchedData: [],
      fuseSearch: null,

      currentSortOrder: "asc",
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0,
      },
    };
  },
  mounted() {
    this.fuseSearch = new Fuse(this.sourceList, {
      keys: ["name", "email"],
      threshold: 0.3,
    });
    this.getSourceList();
  },
  methods: {
    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;
        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return b[sortBy].localeCompare(a[sortBy]);
      });
    },
    addSource() {
      this.$router.push("/configuration/add");
    },
    editSource(id) {
      this.$router.push("/configuration/edit/" + id);
    },
    async getSourceList() {
      try {
        const response = await this.$http({
          method: "GET",
          url: "http://localhost:3003/source",
        });
        this.sourceList = await response.data;
      } catch (error) {
        Swal.fire({
          title: `Error: ${error.response.status} ${error.response.statusText}`,
          icon: "error",
          confirmButtonText: "ปิด",
        });
      }
    },
    removeSource(item) {
      Swal.fire({
        title: "ลบข้อมูลแหล่งข้อมูล",
        text: `คุณต้องการลบข้อมูล : ${item.name} หรือไม่ ?`,
        showCancelButton: true,
        reverseButtons: true,
        icon: "warning",
        confirmButtonColor: "#3177ce",
        cancelButtonColor: "#e65d5d",
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.value) {
          try {
            const sourceResponse = await this.$http({
              method: "DELETE",
              url: "http://localhost:3003/source/" + item._id,
            });
            const cdsResponse = await this.$http({
              method: "DELETE",
              url: "http://localhost:3003/CDS/delete/" + item.cds,
            });
            Swal.fire(`ลบข้อมูล : ${item.name} เสร็จสิ้น`, "", "success");
            this.getSourceList();
          } catch (error) {
            Swal.fire({
              title: `Error: ${error.response.status} ${error.response.statusText}`,
              icon: "error",
              confirmButtonText: "ปิด",
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped></style>
