<template>
    <div class="card">
        <div class="card-image">
            <figure class="image is-square img-card">
                <img :src="props.src" />
            </figure>   
        </div>
        <footer class="card-footer">
            <a href="#" class="card-footer-item">Save</a>
            <a href="#" class="card-footer-item">Edit</a>
            <a href="#" class="card-footer-item">Delete</a>
        </footer>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    src: {
        type: [String],
    },
});
</script>

<style lang="scss" scoped>
.card {
    // width: 18rem ;
    // width: 100%;
    display: block;
}
.img-card {
    img {
        object-fit: cover;
    }

    &:hover {
        //filter: blur(1px);
        // background-color: rgba(26, 26, 26, 0.548);
    }
}
</style>
