<template>
  <div class="header">
    <span>SimpleBoard</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>

<style lang="scss">
.header {
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 64px;
  max-height: 64px;
  background-color: #3578ff;

  span {
    text-align: center;
    font-weight: 600;
    color: white;
    font-size: 2rem;
  }
}
</style>
