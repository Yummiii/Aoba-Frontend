<template>
    <div class="active-area">
        <div class="card">
            <header class="card-header">
                <h1 class="card-header-title is-centered">
                    Fazer login ou se registrar
                </h1>
            </header>
            <div class="card-content">
                <div class="field">
                    <div class="control has-icons-left">
                        <input
                            class="input"
                            type="text"
                            placeholder="Username"
                            ref="username"
                        />
                        <span class="icon is-small is-left">
                            <font-awesome-icon :icon="['fas', 'fa-user']" />
                        </span>
                    </div>
                </div>
                <div class="field">
                    <div class="control has-icons-left">
                        <input
                            class="input"
                            type="password"
                            placeholder="Senha"
                            ref="password"
                        />
                        <span class="icon is-small is-left">
                            <font-awesome-icon :icon="['fas', 'fa-lock']" />
                        </span>
                    </div>
                </div>
            </div>
            <footer class="card-footer">
                <a class="card-footer-item" v-on:click="login">Login</a>
                <a class="card-footer-item" v-on:click="register">Registrar</a>
            </footer>
        </div>
    </div>

    <div class="background"></div>
</template>

<script setup lang="ts">
import { toast } from "bulma-toast";
import { FetchError } from "ohmyfetch";
import { Ref } from "vue";

const username: Ref = ref(null);
const password: Ref = ref(null);

async function login() {
    try {
        const resp: any = await apiFetch("/users/authenticate", {
            method: "POST",
            body: {
                username: username.value.value,
                password: password.value.value,
            },
        });

        localStorage.setItem("token", resp.token);
        toast({
            message: "Logado :)",
            type: "is-success",
        });
        navigateTo("/");
    } catch (e) {
        let msg = "";
        if ((e as FetchError).response.status == 401) {
            msg = "Usuario ou senha errados";
        } else {
            console.log(e);
            msg = "Alguma coisa no servidor deu pau";
        }

        toast({
            message: msg,
            type: "is-danger",
        });
    }
}

async function register() {
    if (username.value.value.length < 3) {
        toast({
            message: "O nome de usuario deve ter pelo menos 3 caracteres",
            type: "is-warning",
        });
        return;
    }
    if (password.value.value.length < 8) {
        toast({
            message: "A senha deve ter pelo menos 8 caracteres",
            type: "is-warning",
        });
        return;
    }

    try {
        await apiFetch("/users/create", {
            method: "POST",
            body: {
                username: username.value.value,
                password: password.value.value,
            },
        });

        toast({
            message: "Conta criada!",
            type: "is-success",
        });

        await login();
    } catch (e) {
        let msg = "";
        if ((e as FetchError).response.status == 409) {
            msg = "Já existe um usuário com esse nome";
        } else {
            console.log(e);
            msg = "Alguma coisa no servidor deu pau";
        }

        toast({
            message: msg,
            type: "is-danger",
        });
    }
}
</script>

<style lang="scss" scoped>
.active-area {
    z-index: 2;
    display: flex;
    flex-direction: column;
    position: absolute;
    align-self: center;
}

.msg {
    z-index: 2;
    position: absolute;
    align-self: end;
    padding-bottom: 1.5rem;
}

.background {
    flex: -moz-available;
    background-image: url("https://cdn.discordapp.com/attachments/435255878464176138/1030619585659027466/Yazawa.Niko.full.3205997.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;

    &:after {
        z-index: 1;
        content: "";
        backdrop-filter: blur(5px);
        flex: -moz-available;
        background-color: rgba(26, 26, 26, 0.548);
    }
}
</style>