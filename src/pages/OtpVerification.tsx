import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const target = params.get("target") || "your email";

  useEffect(() => {
    document.title = "OTP Verification | QuickCourt";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Verify your account with a 6-digit OTP code for QuickCourt.";
    if (meta) meta.setAttribute("content", content);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      const l = document.createElement("link");
      l.rel = "canonical";
      l.href = window.location.href;
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast("Please enter the 6-digit code");
      return;
    }
    
    setIsVerifying(true);

    try {
      // API call to Node.js backend for OTP verification
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          otp, 
          target: params.get("target") || "email" 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast("OTP verified successfully!");
        // Store auth token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        navigate("/profile");
      } else {
        toast(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0) return;
    
    try {
      // API call to Node.js backend to resend OTP
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          target: params.get("target") || "email" 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSeconds(30);
        toast("A new OTP has been sent!");
      } else {
        toast(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">OTP Verification</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {target}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Didn’t receive the code? {" "}
              <button
                type="button"
                onClick={handleResend}
                className="underline underline-offset-4 disabled:opacity-50"
                disabled={seconds > 0}
                aria-label="Resend OTP"
              >
                Resend{seconds > 0 ? ` in ${seconds}s` : ""}
              </button>
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={handleVerify} disabled={isVerifying || otp.length !== 6} variant="hero">
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default OtpVerification;
