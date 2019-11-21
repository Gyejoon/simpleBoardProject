<template>
  <div class="header">
    <div class="wrapper">
      <router-link to="/">SimpleBoard</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>

<style lang="scss">
.header {
  display: block;
  width: 100%;
  height: 64px;
  max-height: 64px;
  background-color: #2196f3;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);

  .wrapper {
    position: relative;
    line-height: 64px;
    height: 100%;

    a {
      position: absolute;
      color: #fff;
      display: inline-block;
      font-size: 2.1rem;
      padding: 0;
      white-space: nowrap;
      text-decoration: none;
    }
  }
}
</style>
