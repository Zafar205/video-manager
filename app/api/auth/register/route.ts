import User from "@/models/User";
import { connectionToDatabase } from "@/utils/db";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


// 5 steps
// 1. get data from Frontend
// 2. validation
// 3. if DB is connected && check if user exist
// 4. create user
// 5. return success

export async function POST(request : NextRequest) {

    try {
        // 1
        const {email, password} = await request.json();

        // 2
        if(!email || !password){
            return NextResponse.json(
                    {error : "Email or Password is required"},
                    {status : 400}
            )
        }

        // 3
        await connectionToDatabase();
        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json(
                {error : "User already exist"},
                {status : 400}
            )
        }

        //4 
        await User.create({
            email,
            password
        })

        //5
        return NextResponse.json(
            {message : "user registered successfully"},
            {status : 200}
        )

    }catch(error){
        console.log("Registration Error", error)
        return  NextResponse.json(
            {error : "Registration failed"},
            {status : 400}
        )

    }
    
}