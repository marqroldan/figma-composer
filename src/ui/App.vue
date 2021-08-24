<template>
  <div class="rootContainer">
    <div class="header">
      <APIKey />
      <GSheetsURL />
      <SheetsList />
    </div>
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
.rootContainer {
  padding: 20;
}

.header {
  display: grid;
  grid-template-columns: 200px 200px 150px;
  column-gap: 10px;
}
</style>
