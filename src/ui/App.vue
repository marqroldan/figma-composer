<template>
  <div>
    <Welcome />
    <APIKey />
    <GSheetsURL />
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import GSheetsURL from "./components/GSheetsURL";
import Welcome from "./components/Welcome";
import { Button } from "figma-plugin-ds-vue";

export default {
  components: {
    Welcome,
    Button,
    APIKey,
    GSheetsURL,
  },
};
</script>

<style lang="scss">
</style>
