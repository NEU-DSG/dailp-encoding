import React, { useState } from "react"
import Link from "src/components/link";
import Layout from "src/layout"
import { centeredColumn } from "src/sprinkles.css"
import { centeredForm, loginFormBox, positionButton, skinnyWidth, submitButton } from "./login.css";

// TODO: this page is  incomplete
const SignupPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (<Layout>
        <main className={skinnyWidth}>
            <header>
                <h1 className={centeredColumn}>Create a New Account</h1>
            </header>

            <form className={centeredForm}>

                <div>
                    <label>
                        Email *</label>
                    <input
                        className={loginFormBox}
                        type="password"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="mail@website.com" />
                </div>

                <div>
                    <label>
                        Password *</label>
                    <input
                        className={loginFormBox}
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="enter password" />
                </div>

                {/* TODO: */}
                <div>
                    <label>
                        Have an account? <Link href="/login">Login</Link>
                    </label>
                </div>

                <div className={positionButton}>
                    <input className={submitButton} type="submit" value="Create" />
                </div>

            </form>


        </main>
    </Layout >)
}

export default SignupPage