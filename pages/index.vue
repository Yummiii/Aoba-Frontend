<template>
    <div id="imgs-container" class="imgs-container" ref="aaa">
        <ImageCard
            v-for="file in dados.files"
            :src="file.url"
            :file-id="file.id"
        />
    </div>
</template>

<script setup lang="ts">
import { toast } from "bulma-toast";
const aaa = ref(null);
const route = useRoute();
const dados = ref({});

try {
    let listing = {};
    if (route.query.folder) {
        listing = await apiFetch(
            `/users/@me/list?folder=${route.query.folder}`
        );
    } else {
        listing = await apiFetch(`/users/@me/list`);
    }
    dados.value.files = [];
    for (const file of listing.files) {
        const fileData = await apiFetch(`/files/${file.id}/data`);
        dados.value.files.push({
            url: URL.createObjectURL(fileData),
            // url: `http://192.168.1.22:8080/files/${file.id}/data`,
            id: file.id,
        });
    }
} catch (e) {
    console.log(e);
    if (process.client) {
        toast({
            message: "Alguma coisa deu pau",
            type: "is-danger",
        });
    }
}

definePageMeta({
    middleware: ["auth"],
});
</script>

<style lang="scss" scoped>
.imgs-container {
    margin: 2rem;
    display: grid;
    height: fit-content;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 20rem));
    // grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    gap: 2rem;
    justify-content: center;
}

.pastas {
    position: absolute;
}
</style>
