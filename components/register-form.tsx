"use client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { signUp } from "@/app/(auth)/register/actions";
import { ChangeEvent, useActionState, useCallback, useState } from "react";

const initialState = {
    errors: {
        name: [],
        email: [],
        password: [],
    },
};

export function RegisterForm() {
    const [state, formAction, pending] = useActionState(signUp, initialState);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const onHandleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your email below to sign up to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4" action={formAction}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Name</Label>
                        <Input
                            value={formData.name}
                            onChange={onHandleChange}
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Mr Oliver"
                        />
                        <p className="text-red-500 text-xs">
                            {state.errors.name}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={onHandleChange}
                            placeholder="mr@example.com"
                        />
                        <p className="text-red-500 text-xs">
                            {state.errors.email}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name="password"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                        <p className="text-red-500 text-xs">
                            {state.errors.password}
                        </p>
                    </div>
                    {pending ? (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    )}
                </form>
                <div className="mt-4 text-center text-sm">
                    You have an account?{" "}
                    <Link href="/login" className="underline">
                        Sign In
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
