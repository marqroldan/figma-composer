<template>
  <div class="rc">
    <Txt>Items</Txt>
    <div class="dataContainer">
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
      <div style="height: 50px; width: 50px; background: red"></div>
    </div>
    <div class="bottom">
      <Button>Test</Button>
    </div>
  </div>
</template>
<script>
import { Select, Txt, Input, Button } from "figma-plugin-ds-vue";

export default {
  components: { Select, Txt, Input, Button },
  computed: {
    items() {
      return this.$store.state.GSheets.sheets.map((item, index) => {
        return {
          value: item,
          label: item,
          key: item,
        };
      });
    },
  },
  data() {
    return {
      selectedSheet: {},
      range: "",
      fetching: false,
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
</style>

<!---

    -->