<template>
  <div class="md-layout">
    <div class="md-layout-item" style="margin: 20px">
      <md-card>
        <md-card-header class="md-card-header-icon">
          <div class="card-icon" style="background-color: #3177ce">
            <md-icon class="md-size-2x">assignment</md-icon>
          </div>
          <h4 class="title" style="color: #3177ce">ค้นหาชุดข้อมูล</h4>
        </md-card-header>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-90">
              <md-field md-clearable>
                <label>ชื่อของชุดข้อมูล</label>
                <md-input placeholder="ชื่อของชุดข้อมูล" v-model="keyword" />
              </md-field>
            </div>
            <div class="md-layout-item md-size-10">
              <md-button class="md-primary" @click="searchCDS()"
                >ค้นหา</md-button
              >
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <collapse
                :collapse="cdsList"
                colorCollapse="primary"
                icon="expand_more"
              />
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import Collapse from "./Collapse";
export default {
  components: { Collapse },
  data() {
    return {
      cdsList: [],
      keyword: "",
    };
  },
  mounted() {},
  methods: {
    async searchCDS() {
      if (this.keyword) {
        const response = await this.$http({
          method: "POST",
          url: "http://localhost:3003/cds/search",
          data: { name: this.keyword },
        });
        this.cdsList = await response.data;
      } else {
        this.cdsList = [];
      }
    },
  },
};
</script>

<style scoped></style>
