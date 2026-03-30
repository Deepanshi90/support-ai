import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";
import { match } from "assert";

export async function proxy(req: NextRequest) {
    const session = await getSession();
    // console.log(session);
    if(!session) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
    }
    return NextResponse.next();
} 

export const config = {
    matcher: "/dashboard/:path*",
}