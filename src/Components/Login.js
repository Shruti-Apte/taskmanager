import React from 'react'

const Login = (props) => {

    const { Email,
        Password,
        setEmail,
        setPassword,
        handleLogin,
        handleSignUp,
        hasAccount,
        sethasAccount,
        EmailError,
        PasswordError } = props;



    return (
    <section className='login'>
        <div className='loginContainer'>
            <label>UserName</label>
            <input type="text" autoFocus required value={Email} onChange={val => setEmail(val.target.value)} />
            <p className='errorMsg'>{EmailError}</p>

            <label>Password</label>
            <input type="password" required autoFocus value={Password} onChange={val => setPassword(val.target.value)} />
            <p className='errorMsg'>{PasswordError}</p>

            <div className='btnContainer'>
                {hasAccount ? (
                    <>
                        <button onClick={()=>handleLogin()}>Sign in</button>
                        <p>Don't have an acoount?<span onClick={()=>sethasAccount(!hasAccount)}>Sign Up</span></p>
                    </>
                ) : (
                    <>
                        <button onClick={()=>handleSignUp()}>Sign Up</button>
                        <p>Alreadt have an acoount?<span onClick={()=>sethasAccount(!hasAccount)}>Sign In</span></p>
                    </>
                )}
            </div>
        </div>
        </section>
    );
}

export default Login;