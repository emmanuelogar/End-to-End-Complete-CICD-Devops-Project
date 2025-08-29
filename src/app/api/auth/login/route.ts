// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/lib/models/user";
import dbConnect from "@/lib/db";
import { generateToken } from "@/lib/auth/utils";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for:', email);

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    // Explicitly cast to IUser after the null check
    const typedUser = user as IUser;

    const isMatch = await typedUser.matchPassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenPayload = {
      // TypeScript now knows that typedUser._id is a valid ObjectId
      userId: typedUser._id.toString(),
      role: typedUser.role,
    };
    console.log('Generating token with payload:', tokenPayload);
    const token = await generateToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: typedUser._id,
        name: typedUser.name,
        email: typedUser.email,
        role: typedUser.role,
      },
      token,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60
    });

    console.log('Login successful for:', email);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}