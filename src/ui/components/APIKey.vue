<template>
  <div>
    <LabelInputButton
      label="GSheets API Key"
      placeholder="Save your GoogleSheets API here"
      :onButtonPress="saveApiKey"
      v-model="inputModel"
      @input="updateData"
    />
  </div>
</template>

<script>
import LabelInputButton from "./LabelInputButton.vue";

const getStoredAPIKey = "getStoredAPIKey";

export default {
  components: {
    LabelInputButton,
  },
  methods: {
    updateData(value) {
      this.inputModel = value;
    },
    updateAPIKey({ data }) {
      if (data.pluginMessage?.type === getStoredAPIKey) {
        this.inputModel = "testing";
        console.log("hm api key", data);
      }
    },
    saveApiKey(apiKey) {
      if (!apiKey) {
        console.log("No value given");
      } else {
        console.log("this shoudl be working");
        parent.postMessage({ pluginMessage: { type: getStoredAPIKey } }, "*");
      }
    },
  },
  data() {
    return {
      inputModel: "", // String || Number
      message: "Welcome to your new Figma Plugin",
    };
  },
  mounted() {
    window.addEventListener("message", this.updateAPIKey);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.updateAPIKey);
  },
};
</script>
