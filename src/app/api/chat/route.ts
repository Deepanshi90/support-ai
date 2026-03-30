// import connectDb from "@/lib/db";
// import Settings from "@/model/settings.model";
// import { GoogleGenAI } from "@google/genai";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const { ownerId, message } = await req.json();
//     if(!ownerId || !message){
//             return NextResponse.json(
//                 {message: "ownerId and message are required"
//             }, { status: 400 });
//         }    
//         await connectDb();
//         const setting = await Settings.findOne({ ownerId });
//         if(!setting){
//             return NextResponse.json(
//                 {message: "Settings not found for the given ownerId"
//             }, { status: 404 });
//         }
//         const KNOWLEDGE = `
//         Business Name: {${setting.businessName} || "not provided"}
//         Support Email: {${setting.supportEmail} || "not provided"}
//         Knowledge: {${setting.knowledge} || "not provided"}
//         `

//         const prompt = `
//         You are a  professional customer support assistant for a business. 
        
//         Use ONLY the information provided belowto answer the customer's questions. 
//         You may rephase,summarize or interpret the information if needed. Do not invent new policies, prices or information. If the information provided is not sufficient to answer the question, say you don't know and suggest the customer to contact support.
//         If the customer's question is completely unreleated to the information, or cannot be reasonably answered from it, reply exactly with:
//         "Please contact support for further assistance."
        
//         ----------------------------
//         BUSINESS INFORMATION
//         ----------------------------
//         ${KNOWLEDGE}
//         ----------------------------
//         CUSTOMER QUESTION:
//         ${message}
//         ----------------------------
//         ANSWER
//         ------------------------------
//         `   
//           const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY!});
//           const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });
//   console.log(res.text);
//     const response =  NextResponse.json(res.text );

//     response.headers.set("Access-Control-Allow-Origin","*");
//     response.headers.set("Access-Control-Allow-Methods","POST,OPTIONS");
// response.headers.set("Access-Control-Allow-Headers","Content-Type");

//      return response

//     }catch (error) {
//         console.log(`API Chat error ${error}`);
//         const response =  NextResponse.json(
//             {message: `An error occurred while processing the request ${error}`
//         }, { status: 500 });
//           response.headers.set("Access-Control-Allow-Origin","*");
//     response.headers.set("Access-Control-Allow-Methods","POST,OPTIONS");
//      response.headers.set("Access-Control-Allow-Headers","Content-Type");
// return response;
//     }
// }

// export const OPTIONS = async()=>{
//     return NextResponse.json(null,{
//         status:201,
//         headers:{
//             "Access-Control-Allow-Origin":"*",
//     "Access-Control-Allow-Methods":"POST,OPTIONS",
//     "Access-Control-Allow-Headers":"Content-Type",
//         }
//     })
// }

import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { ownerId, message } = await req.json();

        if (!ownerId || !message) {
            return NextResponse.json(
                { message: "ownerId and message are required" },
                { status: 400 }
            );
        }

        await connectDb();
        const setting = await Settings.findOne({ ownerId });

        if (!setting) {
            return NextResponse.json(
                { message: "Settings not found for the given ownerId" },
                { status: 404 }
            );
        }

        const KNOWLEDGE = `
        Business Name: {${setting.businessName} || "not provided"}
        Support Email: {${setting.supportEmail} || "not provided"}
        Knowledge: {${setting.knowledge} || "not provided"}
        `;

        const prompt = `
        You are a professional customer support assistant. 
        
        Use ONLY the information provided belowto answer the customer's questions. 
        You may rephase,summarize or interpret the information if needed. Do not invent new policies, prices or information. If the information provided is not sufficient to answer the question, say you don't know and suggest the customer to contact support.
        If the customer's question is completely unreleated to the information, or cannot be reasonably answered from it, reply exactly with:
        "Please contact support for further assistance."
        
        ----------------------------
        BUSINESS INFORMATION
        ----------------------------
        ${KNOWLEDGE}
        ----------------------------
        CUSTOMER QUESTION:
        ${message}
        ----------------------------
        ANSWER
        ------------------------------
        `;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        console.log(res.text);

        const response = NextResponse.json({ reply: res.text }); // ✅ FIXED

        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type"); // ✅ FIXED

        return response;

    } catch (error) {
        console.log(`API Chat error ${error}`);

        const response = NextResponse.json(
            { message: `An error occurred while processing the request ${error}` },
            { status: 500 }
        );

        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return response;
    }
}

// export const OPTIONS = async () => {
//     return NextResponse.json(null, {
//         status: 200, // ✅ FIXED
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Methods": "POST,OPTIONS",
//             "Access-Control-Allow-Headers": "Content-Type",
//         },
//     });
// };
export const OPTIONS = async () => {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
};