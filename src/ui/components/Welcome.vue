<template>
  <div>
    <div class="visual-bell">
      <span class="visual-bell__msg">{{ message }}</span>
    </div>
    <Button @click="sampleButton">Hi!</Button>
  </div>
</template>

<script>
import { Button } from "figma-plugin-ds-vue";

export default {
  components: {
    Button,
  },
  methods: {
    sampleButton() {
      console.log("Hello!");
    },
  },
  data() {
    return {
      message: "Welcome to your new Figma Plugin",
    };
  },
};
</script>

<style lang="scss" scoped></style>
