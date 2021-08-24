<template>
  <div>
    <Label>Sheets List</Label>
    <div class="sheetQuery" v-if="|| items.length">
      <Select :items="items" :value="selectedSheet.key" :disabled="fetching" />
      <Input v-model="range" placeholder="Range (ex. A2:U)" />
      <Button onPress="fetchSheetData">Fetch</Button>
    </div>
  </div>
</template>
<script>
import { Select, Label, Input, Button } from "figma-plugin-ds-vue";

export default {
  components: { Select, Label, Input, Button },
  computed: {
    items() {
      return this.$store.state.GSheets.sheets.map((item, index) => {
        return {
          value: item,
          label: item,
          key: `item-${index + 1}`,
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
    fetchSheetData() {
      //const getSheetValue = this.items.find((item) => item.key === key);
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
