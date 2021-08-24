<template>
  <div>
    <Welcome />
    <APIKey />
    <GSheetsURL />
    <SheetsList />
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import GSheetsURL from "./components/GSheetsURL";
import SheetsList from "./components/SheetsList";
import Welcome from "./components/Welcome";
import { Button } from "figma-plugin-ds-vue";

export default {
  components: {
    Welcome,
    Button,
    APIKey,
    GSheetsURL,
    SheetsList,
  },
};
</script>

<style lang="scss">
</style>
