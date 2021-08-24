<template>
  <div>
    <Welcome />
    <APIKey />
    {{ loading ? "yes i am" : "not loading" }}
    <Button @click="hmmm">Hi!</Button>
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import Welcome from "./components/Welcome";
import { Button } from "figma-plugin-ds-vue";
import { obtainGsheetsData } from "./helpers/gsheets";

export default {
  data() {
    return {
      loading: false,
    };
  },

  components: {
    Welcome,
    Button,
    APIKey,
  },
  methods: {
    hmmm() {
      this.loading = true;
      this.$store.dispatch("fetchGSheetsData", {
        url: "https://docs.google.com/spreadsheets/d/17YXfsS3mB5p174hZmfh_bnzONsdxV_nN13q0qgTDtMg/edit?usp=sharing",
        error: () => {
          console.log("HUH???");
          this.loading = false;
        },
        success: () => {
          console.log("Success!");
          this.loading = false;
        },
      });
    },
  },
  mounted() {
    console.log("HIII");
    // Initialize the figma-ds components
  },
};
</script>

<style lang="scss">
</style>
