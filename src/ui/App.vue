<template>
  <div class="rootContainer">
    <div class="header">
      <APIKey />
      <GSheetsURL />
      <SheetsList />
    </div>
    <DataContainer />
  </div>
</template>

<script>
import APIKey from "./components/APIKey";
import GSheetsURL from "./components/GSheetsURL";
import SheetsList from "./components/SheetsList";
import DataContainer from "./components/DataContainer";
import { Button } from "figma-plugin-ds-vue";

export default {
  components: {
    Button,
    APIKey,
    GSheetsURL,
    DataContainer,
    SheetsList,
  },
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  min-height: 100%;
}

.rootContainer {
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.header {
  display: grid;
  grid-template-columns: 200px 200px 150px;
  column-gap: 10px;
}
</style>
