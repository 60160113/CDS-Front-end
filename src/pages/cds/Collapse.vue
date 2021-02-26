<template>
  <div>
    <div
      :class="[
        'md-collapse',
        activeCollapse(index + 1),
        { [getColorCollapse(colorCollapse)]: true },
      ]"
      v-for="(item, index) in collapse"
      :key="item"
    >
      <div
        class="md-collapse-label"
        @click="toggle(index + 1, item.revision[0])"
      >
        <h5 class="md-collapse-title">
          <div class="md-layout">
            <div class="md-layout-item md-size-10">
              <md-button
                :class="getColorButton(item.method)"
                style="margin: -4px"
                >{{ item.method }}</md-button
              >
            </div>

            <div class="md-layout-item md-size-50" style="margin-left: 5px">
              {{ item.url }}
            </div>
            <div class="md-layout-item md-size-30">
              {{ item.name }}<md-icon>{{ icon }}</md-icon>
            </div>
          </div>
        </h5>
      </div>

      <collapse-transition>
        <div class="md-collapse-content" v-show="getActiveCollapse(index + 1)">
          <slot :name="getCollapseContent(index + 1)">
            <div class="md-layout">
              <div class="md-layout-item">
                <label for="revision" style="color: #3177ce">Revision</label>
                <table id="revision" style="width: 100%">
                  <tr v-for="(data, index) in item.revision" :key="index">
                    <td style="text-center">
                      <md-radio v-model="revision" :value="data" />
                    </td>
                    <td>{{ data.label }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="md-layout" style="margin-top: 20px">
              <div class="md-layout-item">
                <md-field>
                  <label>URL</label>
                  <md-input :value="getUrl(item.url)" readonly :id="item.url" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-10">
                <md-button class="md-primary" @click="copyToClipboard(item.url)"
                  >คัดลอก</md-button
                >
              </div>
            </div>
          </slot>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import { CollapseTransition } from "vue2-transitions";

export default {
  name: "collapse",
  components: {
    CollapseTransition,
  },
  props: {
    collapse: Array,
    icon: String,
    colorCollapse: String,
  },
  data() {
    return {
      isActive: 1,
      revision: "",
    };
  },
  methods: {
    copyToClipboard(element) {
      var copyText = document.getElementById(element);
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
    },
    getUrl(url) {
      return url + (this.revision ? "?revision=" + this.revision.label : "");
    },
    getActiveCollapse(index) {
      return this.isActive == index;
    },
    activeCollapse(index) {
      return {
        "is-active": this.isActive == index,
      };
    },
    toggle(index, startItem) {
      this.revision = startItem;
      if (index == this.isActive) {
        this.isActive = 0;
      } else {
        this.isActive = index;
      }
    },
    getCollapseContent: function (index) {
      return "md-collapse-pane-" + index + "";
    },
    getColorCollapse: function (colorCollapse) {
      return "md-" + colorCollapse + "";
    },
    getColorButton: function (method) {
      let color = "info";
      switch (method) {
        case "POST":
          color = "success";
          break;
        case "PUT":
          color = "warning";
          break;
        case "PATCH":
          color = "primary";
          break;
        case "DELETE":
          color = "danger";
          break;
      }
      return "md-" + color + "";
    },
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  display: flex;
}
table,
th,
td {
  border: 1px solid gray;
  border-collapse: collapse;
}
</style>
