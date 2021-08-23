<template>
  <div>
    <Welcome />
    <APIKey />

    <Button @click="obtainGsheetsData">Hi!</Button>
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import Welcome from "./components/Welcome";
import { Button } from "figma-plugin-ds-vue";
import { obtainGsheetsData } from "./helpers/gsheets";

export default {
  data() {
    return {};
  },

  components: {
    Welcome,
    Button,
    APIKey,
  },

  methods: {
    obtainGsheetsData,
  },

  mounted() {
    console.log("HIII");
    // Initialize the figma-ds components
  },
};
</script>

<style lang="scss">
</style>
