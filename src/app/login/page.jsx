"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { images } from "@/_components/images";
import authInstance from "@/_api/auth";
import { useRouter } from "next/navigation";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        remember: false,
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await authInstance.login({
                email: formData.email,
            });

            const token = response?.data?.token;

            if (!token) {
                throw new Error("Token not found in response");

            }

            // Store token ONLY with required key
            localStorage.setItem("urban_auth_token", token);

            // Navigate after login
              router.push("/create-quotation");

        } catch (error) {
            console.error("Login Error:", error);
        toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
            router.push("/create-quotation");
        }
    };

    // Redirect if already logged in
      useEffect(() => {
        const token = localStorage.getItem("urban_auth_token");
        if (token) {
          router.replace("/create-quotation");
        }
      }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff4e6] px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <Image
                        src={images.logo}
                        alt="UrbanXperts Logo"
                        width={160}
                        height={50}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Tagline */}
                <p className="text-center text-gray-600 mb-6">
                    Your Home, Our Expertise
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                            className="h-4 w-4 accent-orange-500"
                        />
                        <span className="text-sm text-black-600">Remember me</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600
                       disabled:opacity-60 disabled:cursor-not-allowed
                       text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>


            </div>
        </div>
    );
};

export default Login;
