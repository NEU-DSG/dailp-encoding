import React, { useState } from "react"
import Layout from "src/layout"
import { centeredColumn } from "src/sprinkles.css"
import { centeredForm, loginFormBox, positionButton, skinnyWidth, submitButton } from "./login.css";

// TODO: this page is incomplete
const ResetPasswordPage = () => {

    const [email, setEmail] = useState("");

    return (<Layout>
        <main className={skinnyWidth}>
            <header>
                <h1 className={centeredColumn}>Reset Password</h1>
                <h4>Enter the email associated with your account.</h4>
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

                <div className={positionButton}>
                    <input className={submitButton} type="submit" value="Submit" />
                </div>
            </form>

        </main>
    </Layout >)
}

export default ResetPasswordPage