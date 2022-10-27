<template>
    <div class="imgs-container is-centered">
        <ImageCard v-for="n in 1000"/>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth"],
});
</script>

<style lang="scss" scoped>
.imgs-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, clamp(20rem, 40%, 20rem));
    width: 100%;
    height: fit-content;
    row-gap: 2rem;
    padding: 2rem;
}
</style>
