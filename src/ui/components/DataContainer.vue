<template>
  <div class="rc" v-if="true || shouldShow">
    <Txt>Items</Txt>
    <div class="dataContainer">
      <div class="item" v-for="(item, index) in items" :key="index">
        <div style="flex: 1">
          <Checkbox v-model="selected[index]">
            <div class="fieldValues">
              <div
                class="fieldValues__item"
                v-for="(header, headerIndex) in headers"
                :key="headerIndex"
              >
                <span class="headerLabel">{{ header }}</span>
                <span class="value">{{ item[index] }}</span>
              </div>
            </div>
          </Checkbox>
        </div>
        <Button>Preview</Button>
        <Button>Generate</Button>
      </div>
    </div>
    <div class="bottom">
      <Button>Test</Button>
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
      console.log(
        "uhhhhhhhhhhhh",
        !!Object.keys(this.$store.state.GSheets.headers).length,
        this.$store.state.GSheets.headers
      );
      const gg = gg;
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
    };
  },
  methods: {
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
  watch: {
    /*
    items(to, from) {
      if (
        this.selectedSheet.key &&
        !to.some((item) => item.key === this.selectedSheet.key)
      ) {
        this.selectedSheet = {};
      } else {
        if (!this.selectedSheet.key) {
          this.selectedSheet = to[0] || {};
        }
      }
    },
    */
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

  &__item {
    margin-right: 15px;
  }
}
</style>

<!---

    -->