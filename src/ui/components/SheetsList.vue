<template>
  <div>
    <Txt>Sheets List</Txt>
    <Select
      v-if="items.length"
      :items="items"
      @input="fetchSheetData"
      :value="selectedSheet.key"
      :disabled="fetching"
    />
    <!--
    <div class="sheetQuery" 
      v-if="items.length">
      <Input v-model="range" placeholder="Range (ex. A2:U)" />
      <Button onPress="fetchSheetData">Fetch</Button>
    </div>
      -->
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
.sheetQuery {
  display: flex;
}
</style>
