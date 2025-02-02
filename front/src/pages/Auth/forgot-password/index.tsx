
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthHeader } from "@/components/auth-header"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-pink-50 px-4 py-12">
      <div className="mx-auto max-w-md space-y-8">
        <AuthHeader title="Forgot Password?" subtitle="Enter your email to reset your password" />

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <form className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input type="email" placeholder="Email address" className="pl-10" />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <Button className="w-full bg-black text-white hover:bg-black/90">Send Reset Link</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-pink-500 hover:text-pink-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

