<template>
  <div>
    <LabelInputButton
      label="GSheets API Key"
      btnLabel="Save"
      placeholder="Save your GoogleSheets API here"
      :onButtonPress="saveApiKey"
      v-model="inputModel"
      @input="updateData"
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
    updateData(value) {
      const finalValue = value || "";
      this.inputModel = finalValue;
      this.$store.commit("changeKey", finalValue);
    },
    updateAPIKey({ data }) {
      if (
        data.pluginMessage?.type === "API" &&
        data.pluginMessage?.action === "get"
      ) {
        this.inputModel = data.pluginMessage?.value;
        this.$store.commit("changeKey", data.pluginMessage?.value);
      }
    },
    saveApiKey(apiKey) {
      if (apiKey) {
        parent.postMessage(
          { pluginMessage: { type: "API", action: "store", value: apiKey } },
          "*"
        );
      }
    },
  },
  data() {
    return {
      inputModel: "", // String || Number
    };
  },
  mounted() {
    window.addEventListener("message", this.updateAPIKey);
    parent.postMessage({ pluginMessage: { type: "API", action: "get" } }, "*");
  },
  beforeDestroy() {
    window.removeEventListener("message", this.updateAPIKey);
  },
};
</script>
