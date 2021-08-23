<template>
  <div>
    <Label v-if="label">{{ label }}</Label>
    <Input
      icon="key"
      v-bind:placeholder="placeholder"
      v-model="inputValue"
      @input="$emit('input', $event)"
    />
    <Button @click="btnPress">{{ btnLabel }}</Button>
  </div>
</template>

<script>
import { Button, Label, Input } from "figma-plugin-ds-vue";

export default {
  components: {
    Input,
    Label,
    Button,
  },
  props: {
    label: String,
    btnLabel: String,
    placeholder: String,
    onButtonPress: Function,
  },
  methods: {
    btnPress() {
      if (this.onButtonPress) {
        this.onButtonPress(this.inputValue);
      }
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
};
</script>
