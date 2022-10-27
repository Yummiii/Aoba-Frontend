<template>
    <div class="app">
        <nav class="navbar is-dark" role="navigation" aria-label="main navigation">

        </nav>
        <div class="page">
            <NuxtPage />
        </div>
    </div>
</template>

<style lang="scss">
html,
body,
.app {
    height: 100vh;
    width: 100vw;
    margin: unset;
    background-color: black;
}

.app {
    display: flex;
    flex-flow: column;
}

.navbar {
    flex: 0 1 auto;
}

.page {
    flex: 1 1 auto;
    display: flex;
}
</style>
