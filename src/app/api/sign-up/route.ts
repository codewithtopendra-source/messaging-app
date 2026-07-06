import dbConnect from "@/lib/dbConnect";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST ( request: Request ) {
    await dbConnect()

    try{
        const {usernam, email, password} = await request.json()
    }
    catch (error) {
        console.error("Error registering user", error)
        return Response.json(
            {
              success: false,
              message: "Error registering user"  
            },
            {
                status: 500
            }
        )
    }
}