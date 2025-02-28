import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes/common/routePaths";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6  w-full", className)} {...props}>
      <form>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Meetly</span>
            </a>
            <h2 className="text-xl font-bold text-[#0a2540]">
              Sign up with Meetly for free
            </h2>
          </div>
          <div
            className="w-full bg-white flex flex-col gap-5 rounded-[6px] p-[38px_28px]"
            style={{
              boxShadow: "rgba(0, 74, 116, 0.15) 0px 1px 5px",
              border: "1px solid #d4e0ed",
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base">
                  Enter your email to get started.
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="subcribeto@techwithemma.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-base">
                  Enter your full name.
                </Label>
                <Input id="name" type="text" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-base">
                  Choose a password with at least 8 characters.
                </Label>
                <Input id="password" type="password" placeholder="password" />
              </div>
              <div className="flex items-center justify-end">
                <Button type="submit">Continue</Button>
              </div>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="underline underline-offset-4 text-primary"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
