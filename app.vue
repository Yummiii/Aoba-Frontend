<template>
    <div class="root">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <span class="logo-style">Aoba</span>
                </a>
            </div>
        </nav>
        <div id="conteudo" class="conteudo">
            <NuxtPage />
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as bulmaToast from "bulma-toast";
bulmaToast.setDefaults({
    duration: 10000,
    position: "bottom-right",
    dismissible: true,
    animate: { in: "fadeIn", out: "fadeOut" },
});
</script>

<style lang="scss">
html,
body {
    height: 100vh;
    width: 100vw;
    margin: unset;
    background-color: #161b27;
}

.root {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;
}

.navbar {
    flex: 0 1 auto;
    background-color: #372d42;
}

.conteudo {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
}

.logo-style {
    font-family: "Megrim", cursive;
    font-size: 2rem;
    font-weight: 600;
    color: white;
}
</style>
