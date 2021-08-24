<template>
  <div>
    <APIKey />
    <GSheetsURL />
    <SheetsList />
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import GSheetsURL from "./components/GSheetsURL";
import SheetsList from "./components/SheetsList";
import { Button } from "figma-plugin-ds-vue";

export default {
  components: {
    Button,
    APIKey,
    GSheetsURL,
    SheetsList,
  },
};
</script>

<style lang="scss">
</style>
