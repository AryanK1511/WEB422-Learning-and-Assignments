import React from "react";
import { useRouter } from "next/router";

export default function ProductIdDetail() {
    const router = useRouter();
    const { id } = router.query;

    return <h1>{ id }</h1>
}