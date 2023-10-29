import { Handlers } from "$fresh/server.ts";
import OpenAI from "openai";

export const handler: Handlers = {
    async POST(req, _ctx) {

        const { apiKey } = await req.json()

        const openai = new OpenAI({
            apiKey: apiKey,
        });
          
        try {
            await openai.models.list()

            Deno.env.set("OPENAI_KEY", apiKey)

            return new Response(JSON.stringify({
                data: "success"
            }))  
        } catch (error) {
            return new Response(JSON.stringify(error), {
                status: 401
            })
        }


    }
}