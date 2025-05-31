  "use client"

  import { useState } from "react"
  import { useRouter } from "next/navigation"
  import { signIn } from "next-auth/react"
  import { useForm } from "react-hook-form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import * as z from "zod"
  import { Loader2 } from "lucide-react"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  import { Label } from "@/components/ui/label"
  import { useToast } from "@/hooks/use-toast"

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })

  type FormValues = z.infer<typeof formSchema>

  export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: FormValues) => {
      setIsLoading(true)

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        })

        if (result?.error) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          })
        } else {
          router.push("/admin")
          router.refresh()
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="font-pacifico text-3xl text-primary">Collinspiration</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to access your admin dashboard</p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
