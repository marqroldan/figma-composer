<template>
  <div>
    <Label>Sheets List</Label>
    <Select v-if="items.length" :items="items" :value="selectedSheet.key" />
  </div>
</template>
<script>
import { Select, Label } from "figma-plugin-ds-vue";

export default {
  components: { Select, Label },
  computed: {
    items() {
      return this.$store.state.GSheets.sheets.map((item, index) => {
        return {
          label: item,
          key: `item-${index + 1}`,
        };
      });
    },
  },
  data() {
    return {
      selectedSheet: {},
    };
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
