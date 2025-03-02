<script setup>
import { RouterView } from "vue-router";
import AppNav from "./AppNav.vue";
</script>
<template>
    <div class="fixed inset-0 flex flex-nowrap justify-start items-stretch">
        <AppNav class="w-56 grow-0 shrink-0"></AppNav>
        <RouterView class="w-1 grow shrink"></RouterView>
    </div>
</template>