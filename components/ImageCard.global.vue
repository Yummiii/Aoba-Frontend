<template>
    <div class="card img-card">
        <figure class="image is-square img-card">
            <img :src="props.src" :file-id="props.fileId" />
        </figure>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    src: {
        type: [String],
    },
    fileId: {
        type: [String]
    }
});
</script>

<style lang="scss" scoped>
.img-card {
    // height: 18rem;
    // width: 18rem;
    border-radius: 15px;

    img {
        object-fit: cover;
        border-radius: 15px;
    }
}
</style>
