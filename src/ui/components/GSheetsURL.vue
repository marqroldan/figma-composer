<template>
  <div>
    <LabelInputButton
      label="GSheets URL"
      btnLabel="Fetch"
      placeholder="Save your GoogleSheets API here"
      :onButtonPress="fetchSheetsData"
      v-model="url"
      @input="updateURL"
    />
  </div>
</template>

<script>
import LabelInputButton from "./LabelInputButton.vue";

export default {
  components: {
    LabelInputButton,
  },
  methods: {
    updateURL(value) {
      this.$store.commit("changeSheetsURL", value || "");
    },
    fetchSheetsData() {
      this.loading = true;
      this.$store.dispatch("fetchGSheetsData", {
        url: this.url,
        error: () => {
          this.loading = false;
        },
        success: () => {
          this.loading = false;
        },
      });
    },
  },
  data() {
    return {
      url: "", // String || Number
      loading: false,
    };
  },
};
</script>
