import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Registration() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name_d, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        if (email && password) {
            navigate("/dashboard");
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
            <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-md border border-emerald-400">
                <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
                    Create Your Account
                </h2>
                <form className="gap-4 place-content-center place-items-center grid grid-cols-2">
                    <div>
                        <label>Email</label>
                        <input 
                            type="email"
                            placeholder="Enter your Email"
                            className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            value={name_d}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Mobile No.</label>
                        <input
                            type="number"
                            placeholder="Enter your Mobile No."
                            className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                   
                </form>
                 <button
                        type="submit"
                        className="w-full py-3 rounded mt-5 bg-emerald-500 text-black font-bold hover:bg-emerald-600 transition"
                    onSubmit={handleRegister} >
                        Register
                    </button>
                <p className="mt-6 text-center text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-emerald-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
