import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";
import AccessDenied from "../components/access-denied";

export default function Dashboard() {
    const { data: session, status } = useSession();


    if(status === "unauthenticated") {
        return (
            <>{status}</>
        )
    }
    return (
        <>
        Dashboard
        </>
    )
}