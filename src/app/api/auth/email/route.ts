import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { signIn } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      console.error('Email is missing from request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code for:', email);
    
    // Create response with cookie
    const response = NextResponse.json({ message: 'Verification email sent' });
    
    // Set cookie in the response
    response.cookies.set('verification_code', verificationCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
    });

    // Send verification email
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome to Clarity Coach!</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    console.log('Verification email sent successfully to:', email);
    return response;
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      console.error('Email or code is missing from request');
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const storedCode = req.cookies.get('verification_code')?.value;

    if (!storedCode) {
      console.error('No verification code found in cookies');
      return NextResponse.json(
        { error: 'Verification code expired or not found' },
        { status: 400 }
      );
    }

    if (storedCode !== code) {
      console.error('Invalid verification code provided');
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Sign in with NextAuth.js
    const result = await signIn('email', {
      email,
      redirect: false,
      callbackUrl: '/verify/device',
    });

    if (!result?.ok) {
      console.error('Failed to sign in with NextAuth.js:', result?.error);
      return NextResponse.json(
        { error: 'Failed to sign in' },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({ 
      message: 'Email verified successfully',
      redirect: '/verify/device'
    });
    
    // Clear the verification code cookie
    response.cookies.delete('verification_code');

    console.log('Email verified successfully for:', email);
    return response;
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 