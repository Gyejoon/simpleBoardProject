<template>
  <div class="home">
    <Header />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
