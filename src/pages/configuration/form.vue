<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <simple-wizard
        :title="title"
        subTitle=""
        prevButtonText="ย้อนกลับ"
        nextButtonText="ถัดไป"
        finishButtonText="บันทึก"
        style="margin: 20px"
        :finishFunction="$route.params.id ? update : insert"
      >
        <!-- tab 01 -->
        <wizard-tab
          label="ข้อมูลการนำเข้าแหล่งข้อมูล"
          :beforeChange="validateFirstTab()"
        >
          <div class="md-layout">
            <div class="md-layout-item md-size-15">
              <md-field>
                <label for="methods">Methods</label>
                <md-select id="methods" v-model="sourceData.method">
                  <md-option
                    v-for="item in methodList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    {{ item }}
                  </md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-70">
              <md-field md-clearable>
                <label>URL</label>
                <md-input
                  v-model="sourceData.url"
                  placeholder="Enter request URL"
                  @keyup="response = null"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-toolbar-section-end md-size-15">
              <md-button class="md-primary" @click="requestAPI()"
                >ตัวอย่างข้อมูล</md-button
              >
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <md-radio v-model="inputWindow" value="Query Params"
                >Query Params</md-radio
              >
              <md-radio v-model="inputWindow" value="Headers">Headers</md-radio>
              <md-radio v-model="inputWindow" value="Body">Body</md-radio>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <md-card>
                <md-card-header>
                  <div class="md-toolbar-section-start" style="color: #3177ce">
                    {{ inputWindow }}
                  </div>
                </md-card-header>

                <md-card-content>
                  <md-button class="md-primary" @click="addTableCell()"
                    ><md-icon>add_to_photos</md-icon>เพิ่ม</md-button
                  >
                  <!-- Query Params -->
                  <md-table v-if="inputWindow == 'Query Params'">
                    <md-table-row>
                      <md-table-head>Key</md-table-head>
                      <md-table-head>Value</md-table-head>
                      <md-table-head>Action</md-table-head>
                    </md-table-row>

                    <md-table-row :key="index" v-for="index in row.queryParams">
                      <md-table-cell
                        ><input
                          v-model="sourceData.queryParams[index].key"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell
                        ><input
                          v-model="sourceData.queryParams[index].value"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell class="text-center"
                        ><md-button
                          class="md-icon-button md-danger"
                          @click="removeTableCell(index)"
                          ><md-icon>close</md-icon></md-button
                        ></md-table-cell
                      >
                    </md-table-row>
                  </md-table>

                  <!-- Headers -->
                  <md-table v-else-if="inputWindow == 'Headers'">
                    <md-table-row>
                      <md-table-head>Key</md-table-head>
                      <md-table-head>Value</md-table-head>
                      <md-table-head>Action</md-table-head>
                    </md-table-row>

                    <md-table-row :key="index" v-for="index in row.headers">
                      <md-table-cell
                        ><input
                          v-model="sourceData.headers[index].key"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell
                        ><input
                          v-model="sourceData.headers[index].value"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell class="text-center"
                        ><md-button
                          class="md-icon-button md-danger"
                          @click="removeTableCell(index)"
                          ><md-icon>close</md-icon></md-button
                        ></md-table-cell
                      >
                    </md-table-row>
                  </md-table>

                  <!-- body -->
                  <md-table v-else>
                    <md-table-row>
                      <md-table-head>Key</md-table-head>
                      <md-table-head>Value</md-table-head>
                      <md-table-head>Action</md-table-head>
                    </md-table-row>

                    <md-table-row :key="index" v-for="index in row.body">
                      <md-table-cell
                        ><input
                          v-model="sourceData.body[index].key"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell
                        ><input
                          v-model="sourceData.body[index].value"
                          style="width: 100%"
                      /></md-table-cell>
                      <md-table-cell class="text-center"
                        ><md-button
                          class="md-icon-button md-danger"
                          @click="removeTableCell(index)"
                          ><md-icon>close</md-icon></md-button
                        ></md-table-cell
                      >
                    </md-table-row>
                  </md-table>
                </md-card-content>
              </md-card>
            </div>
          </div>
          <div class="md-layout" style="margin-top: -30px">
            <div class="md-layout-item">
              <md-card>
                <md-card-header>
                  <div class="md-toolbar-section-start" style="color: #3177ce">
                    Response
                  </div>
                </md-card-header>
                <md-card-content>
                  {{ response }}
                </md-card-content>
              </md-card>
            </div>
          </div>
        </wizard-tab>

        <!-- tab 02 -->
        <wizard-tab
          label="ข้อมูลการกำหนด API"
          :beforeChange="validateSecondTab()"
        >
          <div class="md-layout">
            <div class="md-layout-item md-size-15">
              <md-field>
                <label for="methodList">Methods</label>
                <md-select id="methodList" v-model="cdsProperties.method">
                  <!-- <md-option
                    v-for="item in methodList"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                    {{ item }}
                  </md-option> -->
                  <md-option label="GET" value="GET"> GET </md-option>
                  <md-option label="POST" value="POST"> POST </md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-85">
              <md-field>
                <label>URL</label>
                <md-input
                  readonly
                  placeholder="Enter URL"
                  v-model="cdsProperties.url"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <md-card>
                <md-card-header>
                  <div class="md-toolbar-section-start" style="color: #3177ce">
                    Query Params
                  </div>
                </md-card-header>

                <md-card-content>
                  <md-table>
                    <md-table-row>
                      <md-table-head>Key</md-table-head>
                      <md-table-head>Value</md-table-head>
                    </md-table-row>

                    <md-table-row>
                      <md-table-cell
                        ><input style="width: 100%" value="revision" disabled
                      /></md-table-cell>
                      <md-table-cell
                        ><input
                          style="width: 100%"
                          v-model="cdsProperties.revision"
                          disabled
                      /></md-table-cell>
                    </md-table-row>
                  </md-table>
                </md-card-content>
              </md-card>
            </div>
          </div>
          <div class="md-layout" style="margin-top: -30px">
            <div class="md-layout-item">
              <md-card>
                <md-card-header>
                  <div class="md-toolbar-section-start" style="color: #3177ce">
                    ข้อมูลทั่วไป
                  </div>
                </md-card-header>
                <md-card-content>
                  <md-field
                    md-clearable
                    v-if="response && response.hasOwnProperty('name')"
                  >
                    <label>ชื่อของข้อมูลพื้นฐาน</label>
                    <md-input
                      placeholder="ชื่อของข้อมูลพื้นฐาน"
                      v-model="response.name"
                    />
                  </md-field>
                  <md-field>
                    <label>คำอธิบาย</label>
                    <md-textarea v-model="cdsProperties.description" />
                  </md-field>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </wizard-tab>

        <!-- tab 03 -->
        <wizard-tab label="ข้อมูลกำหนดการนำเข้าข้อมูล">
          <div class="md-layout">
            <div class="md-layout-item md-size-15">
              <md-field>
                <label for="schedule">รูปแบบกำหนดการ</label>
                <md-select id="schedule" v-model="schedule.type">
                  <md-option
                    v-for="item in scheduleList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-25">
              <!-- <label for="date" style="font-size: 11px; color: #b7b7b7"
                >รูปแบบกำหนดการ</label
              > -->
              <md-datepicker id="date" v-model="schedule.date" />
            </div>
            <div class="md-layout md-alignment-center-left">
              <input
                type="number"
                style="width: 50px"
                v-model="schedule.time.hours"
                min="0"
                max="23"
              />
              <p style="margin-left: 10px; font-weight: bold">:</p>
              <input
                type="number"
                style="margin-left: 10px; width: 50px"
                v-model="schedule.time.minutes"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div class="md-layout">
            <div class="md-layout-item">
              <md-field>
                <label>หมายเหตุ</label>
                <md-textarea v-model="schedule.note" />
              </md-field>
            </div>
          </div>
        </wizard-tab>
      </simple-wizard>
    </div>
  </div>
</template>

<script>
import simpleWizard from "@/components/Wizard/Wizard";
import wizardTab from "@/components/Wizard/WizardTab";
import Swal from "sweetalert2";

import scheduleList from "./scheduleList";

export default {
  components: { simpleWizard, wizardTab },
  data() {
    return {
      inputWindow: "Query Params",

      methodList: ["GET", "POST", "PUT", "PATCH", "DELETE"],

      sourceData: {
        method: "GET",
        url: "",
        queryParams: [{ key: "", value: "" }],
        headers: [{ key: "", value: "" }],
        body: [{ key: "", value: "" }],
      },
      row: {
        queryParams: 0,
        headers: 0,
        body: 0,
      },
      cdsProperties: {
        method: "GET",
        url: "localhost:3003/cds/",
        description: "",
        revision: new Date().toLocaleDateString("en-GB"),
      },

      scheduleList,
      schedule: {
        type: "years",
        date: new Date(),
        time: {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
        },
        note: "",
      },

      cdsId: "",
      response: null,

      title: "",
    };
  },
  mounted() {
    if (this.$route.params.id) {
      this.getEditFormData();
    } else {
      this.title = "เพิ่มแหล่งข้อมูล";
      this.getNewId();
    }
  },
  methods: {
    addTableCell() {
      switch (this.inputWindow) {
        case "Query Params":
          this.sourceData.queryParams.push({ key: "", value: "" });
          this.row.queryParams++;
          break;
        case "Headers":
          this.sourceData.headers.push({ key: "", value: "" });
          this.row.headers++;
          break;
        default:
          this.sourceData.body.push({ key: "", value: "" });
          this.row.body++;
          break;
      }
    },
    removeTableCell(index) {
      switch (this.inputWindow) {
        case "Query Params":
          this.sourceData.queryParams.splice(index, 1);
          this.row.queryParams--;
          break;
        case "Headers":
          this.sourceData.headers.splice(index, 1);
          this.row.headers--;
          break;
        default:
          this.sourceData.body.splice(index, 1);
          this.row.body--;
          break;
      }
    },
    async requestAPI() {
      this.response = null;
      let body = {},
        queryParams = {},
        header = {};

      // set body //
      this.sourceData.body
        .filter((data) => data.key != "")
        .forEach((element) => {
          body[element.key] = element.value;
        });

      // set query params //
      this.sourceData.queryParams
        .filter((data) => data.key != "")
        .forEach((element) => {
          queryParams[element.key] = element.value;
        });

      // set header //
      this.sourceData.headers
        .filter((data) => data.key != "")
        .forEach((element) => {
          header[element.key] = element.value;
        });
      try {
        const response = await this.$http({
          method: this.sourceData.method,
          url: this.sourceData.url,
          headers: header,
          params: queryParams,
          data: body,
        });

        this.response = await response.data;
      } catch (error) {
        Swal.fire({
          title: `Error: ${error.response.status} ${error.response.statusText}`,
          icon: "error",
          confirmButtonText: "ปิด",
        });
      }
    },
    validateFirstTab() {
      let url = this.sourceData.url,
        response = this.response;
      return function () {
        if (url && response && response.hasOwnProperty("name")) {
          return true;
        } else {
          Swal.fire({
            title: "กรุณากรอกข้อมูลให้ครบถ้วน",
            icon: "error",
            confirmButtonText: "ปิด",
          });
        }
        return false;
      };
    },
    validateSecondTab() {
      let url = this.cdsProperties.url,
        id = this.cdsId;
      return function () {
        if (parseInt(url.lastIndexOf(id)) + id.length == url.length) {
          return true;
        } else {
          Swal.fire({
            title: "กรุณาแก้ไข URL",
            icon: "error",
            confirmButtonText: "ปิด",
          });
        }
        return false;
      };
    },
    async getNewId() {
      const newId = await this.$http({
        method: "GET",
        url: "http://localhost:3003/cds/newId",
      });
      this.cdsId = await newId.data;
      this.cdsProperties.url += await this.cdsId;
    },
    async getEditFormData() {
      const sourceResponse = await this.$http({
        method: "GET",
        url: "http://localhost:3003/source/" + this.$route.params.id,
      });
      this.title = "แก้ไขแหล่งข้อมูล";

      Object.keys(this.sourceData).forEach((element) => {
        this.sourceData[element] = sourceResponse.data[element];
      });
      this.row.queryParams = this.sourceData.queryParams.length;
      this.row.body = this.sourceData.body.length;
      this.row.headers = this.sourceData.headers.length;

      sourceResponse.data.schedule.date = new Date(
        sourceResponse.data.schedule.date
      );
      this.schedule = sourceResponse.data.schedule;

      const cdsResponse = await this.$http({
        method: "GET",
        url: "http://localhost:3003/CDS/getById/" + sourceResponse.data.cds,
      });

      this.cdsProperties.method = cdsResponse.data.method;
      this.cdsProperties.url = cdsResponse.data.url;
      this.cdsProperties.description = cdsResponse.data.description;

      this.cdsId = cdsResponse.data._id;

      this.requestAPI();
    },
    async insert() {
      this.sourceData["name"] = this.response.name;
      this.sourceData["schedule"] = this.schedule;
      this.sourceData.queryParams.shift();
      this.sourceData.body.shift();
      this.sourceData.headers.shift();
      this.sourceData["cds"] = this.cdsId;

      this.cdsProperties["name"] = this.sourceData.name;

      const revisionLabel = this.cdsProperties.revision;
      delete this.cdsProperties.revision;

      this.cdsProperties["revision"] = {
        label: revisionLabel,
        value: this.response.value,
        dataSet: this.response.dataSet,
      };

      this.cdsProperties["_id"] = this.cdsId;
      try {
        const sourceResponse = await this.$http({
          method: "POST",
          url: "http://localhost:3003/source",
          data: this.sourceData,
        });
        const cdsResponse = await this.$http({
          method: "POST",
          url: "http://localhost:3003/CDS",
          data: this.cdsProperties,
        });
        Swal.fire({
          title: "นำเข้าแหล่งข้อมูลเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ปิด",
        }).then(() => {
          this.$router.push("/configuration");
        });
      } catch (error) {
        Swal.fire({
          title: `Error: ${error.response.status} ${error.response.statusText}`,
          icon: "error",
          confirmButtonText: "ปิด",
        });
      }
    },
    async update() {
      this.sourceData["name"] = this.response.name;
      this.sourceData["schedule"] = this.schedule;

      delete this.cdsProperties.revision;
      this.cdsProperties["name"] = this.response.name;

      try {
        const sourceResponse = await this.$http({
          method: "PUT",
          url: "http://localhost:3003/source/" + this.$route.params.id,
          data: this.sourceData,
        });
        const cdsResponse = await this.$http({
          method: "PUT",
          url: "http://localhost:3003/CDS/update/" + this.cdsId,
          data: this.cdsProperties,
        });
        Swal.fire({
          title: "แก้ไขแหล่งข้อมูลเสร็จสิ้น",
          icon: "success",
          confirmButtonText: "ปิด",
        }).then(() => {
          this.$router.push("/configuration");
        });
      } catch (error) {
        Swal.fire({
          title: `Error: ${error.response.status} ${error.response.statusText}`,
          icon: "error",
          confirmButtonText: "ปิด",
        });
      }
    },
  },
};
</script>

<style scoped></style>
