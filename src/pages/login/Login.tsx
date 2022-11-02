import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Login.module.css";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "bulma-toast";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../api/apiFetch";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const form = useForm<LoginDto>();

    async function login(e: LoginDto) {
        try {
            const {data} = await apiFetch.post("/users/authenticate", e);
            localStorage.setItem("token", data.token);
            toast({
                message: "Logado",
                type: "is-success"
            })
            navigate("/")
        } catch (err) {
            if (err instanceof AxiosError) {
                let msg = "";
                if (err.response?.status == 401) {
                    msg = "Usuario ou senha errados";
                } else {
                    msg = "Alguma coisa no servidor deu pau";
                }

                toast({
                    message: msg,
                    type: "is-danger",
                });
            }
        }
    }

    async function register() {
        const user = form.getValues();
        if (user.username.length < 3) {
            toast({
                message: "O nome de usuario deve ter pelo menos 3 caracteres",
                type: "is-warning",
            });
            return;
        }

        if (user.password.length < 8) {
            toast({
                message: "A senha deve ter pelo menos 8 caracteres",
                type: "is-warning",
            });
            return;
        }

        try {
            await apiFetch.post("/users/create", user);
            toast({
                message: "Conta criada!",
                type: "is-success",
            });

            await login(user);
        } catch (err) {
            let msg = "";
            if (err instanceof AxiosError) {
                if (err.response?.status == 409) {
                    msg = "Já existe um usuário com esse nome";
                } else {
                    msg = "Alguma coisa no servidor deu pau";
                }
            }

            toast({
                message: msg,
                type: "is-danger",
            });
        }
    }

    return (
        <>
            <div className={style.activeArea}>
                <div className="card">
                    <form onSubmit={form.handleSubmit(login)}>
                        <header className="card-header">
                            <h1 className="card-header-title is-centered">
                                Fazer login ou se registrar
                            </h1>
                        </header>
                        <div className="card-content">
                            <div className="field">
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Username"
                                        {...form.register("username")}
                                    />
                                    <span className="icon is-small is-left">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control has-icons-left">
                                    <input
                                        className="input"
                                        type="password"
                                        placeholder="Senha"
                                        {...form.register("password")}
                                    />
                                    <span className="icon is-small is-left">
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <footer className="card-footer">
                            <button
                                className={`card-footer-item ${style.foda}`}
                            >
                                Login
                            </button>
                            <button
                                className={`card-footer-item ${style.foda}`}
                                type="button"
                                onClick={register}
                            >
                                Registrar
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
            <div className={style.background} style={{backgroundImage: `url(${localStorage.getItem("API_URL_OVERRIDE") || import.meta.env.VITE_API_URL}/files/public/random)`}}></div>
        </>
    );
};

export interface LoginDto {
    username: string;
    password: string;
}
export default Login;
