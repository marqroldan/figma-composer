<template>
  <div>
    <Txt v-if="label">{{ label }}</Txt>
    <div class="input-button">
      <Input
        :icon="icon"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder"
        :spinning="spinning"
        :border="border"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
      />
      <Button @click="btnPress">{{ btnLabel }}</Button>
    </div>
  </div>
</template>

<script>
import { Button, Txt, Input } from "figma-plugin-ds-vue";

export default {
  components: {
    Txt,
    Input,
    Button,
  },
  props: {
    label: String,
    btnLabel: String,
    onButtonPress: Function,

    icon: { type: String, default: undefined },
    iconText: { type: String, default: undefined },
    value: { type: String | Number, default: undefined },
    placeholder: { type: String, default: undefined },
    disabled: Boolean,
    border: Boolean,
    spinning: Boolean,
  },
  methods: {
    btnPress() {
      if (this.onButtonPress) {
        this.onButtonPress(this.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.input-button {
  display: flex;
}
</style>