"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { singIn } from "@/app/(public)/login/actions";

const initialState = {
    errors: { password: [], email: [] },
};

export function LoginForm() {
    const [state, formAction] = useActionState(singIn, initialState);
    const [name, setName] = useState("");

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="m@example.com"
                        />
                        <div className="text-red-500 font-bold text-xs">
                            {state.errors.email}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="#"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <Input id="password" type="password" name="password" />
                        <div className="text-red-500 font-bold text-xs">
                            {state.errors.password}
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                    <Button
                        onClick={() => (window.location.href = "/auth/google")}
                        variant="outline"
                        className="w-full"
                        type="button"
                    >
                        Login with Google
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
