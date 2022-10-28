<template>
    <div id="imgs-container" class="imgs-container" ref="aaa">
        <ImageCard v-for="file in dados.files" :src="file.url" :file-id="file.id" />
    </div>
</template>

<script setup lang="ts">
import { toast } from "bulma-toast";
const aaa = ref(null);
const route = useRoute();
const dados = ref({});

if (process.client) {
    await getData();
    const conteudo = document.getElementById("conteudo");
    const container = document.getElementById("imgs-container");

    function quantidadeImagens() {
        if (container) {
            const columns = Math.floor(
                conteudo.clientWidth / convertRemToPixels(20)
            );
            container.style.setProperty("--columns", columns.toString());
        }
    }

    quantidadeImagens();
    window.onresize = () => quantidadeImagens();
}

async function getData() {
    try {
        let listing = {};
        if (route.query.folder) {
            listing = await apiFetch(`/users/@me/list?folder=${route.query.folder}`);
        } else {
            listing = await apiFetch(`/users/@me/list`);
        }        
        dados.value.files = [];
        for (const file of listing.files) {
            const fileData = await apiFetch(`/files/${file.id}/data`);
            dados.value.files.push({
                url: URL.createObjectURL(fileData),
                id: file.id
            });
        }
    } catch (e) {
        console.log(e);
        toast({
            message: "Alguma coisa deu pau",
            type: "is-danger",
        });
    }
}

function convertRemToPixels(rem) {
    return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
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
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 2rem;
}

.pastas {
    position: absolute;
}
</style>
