<template>
  <div class="rc" v-if="true || shouldShow">
    <Txt>Items</Txt>
    <div class="dataContainer">
      <div class="item" v-for="(item, index) in items" :key="index">
        <div style="flex: 1">
          <Checkbox v-model="selected[index]">
            <div class="fieldValues">
              <span
                class="fieldValues__item"
                v-for="(header, headerIndex) in headers"
                :key="headerIndex"
              >
                <span class="headerLabel">{{ header }}</span>
                <span class="value">{{ item[headerIndex] }}</span>
              </span>
            </div>
          </Checkbox>
        </div>
        <div class="btnWrapper">
          <Button @click="preview(item)">Preview</Button>
        </div>
        <div class="btnWrapper">
          <Button @click="generate(item)">Generate</Button>
        </div>
      </div>
    </div>
    <div class="bottom">
      <Button @click="selectAll">{{
        allSelected ? "Deselect All" : "Select All"
      }}</Button>
      <div class="message"></div>
      <Button @click="generateAll">Generate</Button>
    </div>
  </div>
</template>
<script>
import { Select, Checkbox, Txt, Input, Button } from "figma-plugin-ds-vue";

export default {
  components: { Select, Txt, Input, Button, Checkbox },
  computed: {
    headers() {
      return (
        this.$store.state.GSheets.headers[
          this.$store.state.GSheets.currentSheet
        ] || []
      );
    },
    shouldShow() {
      return !!Object.keys(this.$store.state.GSheets.headers).length;
    },
    items() {
      return (
        this.$store.state.GSheets.sheetData[
          this.$store.state.GSheets.currentSheet
        ] || []
      );
    },
  },
  data() {
    return {
      selectedSheet: {},
      range: "",
      fetching: false,
      selected: [],
      allSelected: false,
    };
  },
  methods: {
    messageHandler({ data }) {
      if (data.pluginMessage?.type === "Compose") {
        switch (data.pluginMessage?.action) {
          case "progress": {
            break;
          }
          case "error": {
            break;
          }
          case "export": {
            break;
          }
        }
      }
    },
    generateAll() {
      console.log("generateAll");
      parent.postMessage(
        {
          pluginMessage: {
            type: "Compose",
            action: "generateAll",
            headers: this.headers,
            items: this.items.filter(
              (item, index) => this.selected[index] !== false
            ),
          },
        },
        "*"
      );
    },
    generate(item) {
      console.log("generate", item);
      parent.postMessage(
        {
          pluginMessage: {
            type: "Compose",
            action: "generate",
            headers: this.headers,
            item,
          },
        },
        "*"
      );
    },
    preview(item) {
      console.log("preview", item);
      parent.postMessage(
        {
          pluginMessage: {
            type: "Compose",
            action: "preview",
            headers: this.headers,
            item,
          },
        },
        "*"
      );
    },
    selectAll() {
      if (this.allSelected) {
        this.allSelected = false;
        this.selected = this.items.map((item) => false);
      } else {
        this.allSelected = true;
        this.selected = this.items.map((item) => true);
      }
    },
    fetchSheetData(key) {
      const selectedSheet = this.items.find((item) => item.key === key);
      if (selectedSheet) {
        this.fetching = true;
        this.$store.dispatch("fetchSheetRows", {
          sheetName: selectedSheet.value,
          error: () => {
            this.fetching = false;
          },
          success: () => {
            this.fetching = false;
          },
        });
      }
    },
  },
  mounted() {
    window.addEventListener("message", this.messageHandler);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.messageHandler);
  },
};
</script>

<style lang="scss" scoped>
.dataContainer {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  border: 1px solid #e5e5e5;
}

.bottom {
  display: flex;
}

.btnWrapper {
  margin-left: 5px;
}

.message {
  flex: 1;
  text-align: right;
}

.rc {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  height: 100%;
}

.item {
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
  width: 100%;
  display: flex;
  align-items: center;
}

.headerLabel {
  display: inline-block;
  margin-right: 5px;
  font-weight: "bold";
}

.fieldValues {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  flex: 1;
  max-height: 35px;
  align-self: center;
  -webkit-line-clamp: 2;

  &__item {
    display: inline-block;
    margin-right: 15px;
  }
}
</style>
