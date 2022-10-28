<template>
    <div class="modal" :class="{ 'is-active': active }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Adicionar uma imagem(s)</p>
                <button class="delete" v-on:click="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="cards">
                    <ImageUploadCard v-for="img in files" :src="img" />
                </div>
            </section>
            <footer class="modal-card-foot" style="justify-content: center">
                <button class="button is-info" v-on:click="filesInput.click()">
                    Selecionar imagens
                </button>
                <button class="button is-primary" v-on:click="upload">Upload</button>
            </footer>
        </div>
        <input
            style="display: none"
            ref="filesInput"
            type="file"
            @change="files_selected"
            multiple
        />
    </div>
</template>

<script lang="ts" setup>
import { Ref } from "vue";

const active: Ref = ref(false);
const filesInput: Ref = ref(null);
const files: Ref = ref([]);

defineExpose({
    active,
});

function files_selected(e) {
    files.value = [];
    for (const file of e.target.files) {
        files.value.push(URL.createObjectURL(file));
    }
}

async function upload() {
    for (const file of filesInput.value.files) {
        const form = new FormData();
        form.append("file", file);
        form.append("mimeType", file.type);
        form.append("pub", "false")
        form.append("pubList", "false")

        const a = await apiFetch("/files/upload", {
            method: "POST",
            body: form
        })
        console.log(a);
    }
}

function close() {
    files.value = [];
    active.value = false;
}
</script>

<style lang="scss" scoped>
.cards {
    display: grid;
    height: fit-content;
    width: 100%;
    gap: 1rem;
    // grid-template-columns: repeat(auto-fit, minmax(48%, 1fr));
    // grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    grid-template-columns: repeat(auto-fit, minmax(18rem, 18rem));
    justify-content: center;
}
</style>
