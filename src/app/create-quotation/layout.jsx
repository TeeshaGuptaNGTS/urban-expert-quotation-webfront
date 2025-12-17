"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateQuotationLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("urban_auth_token");

//     if (!token) {
//       router.replace("/login"); 
//     } else {
//       setAuthorized(true); 
//     }
//   }, [router]);

  
//   if (!authorized) return null;

  return <>{children}</>;
}
