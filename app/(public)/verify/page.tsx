import {
    AlertDestructive,
    AlertSuccess,
} from "@/components/custom/alert-destructive";
import { Button } from "@/components/ui/button";
import { jwtVerify } from "@/lib/jwt";
import { searchParamsPromise } from "@/types";

const verified = async (token: string) => {
    try {
        const { payload } = await jwtVerify(token);
        return { payload, error: false };
    } catch {
        return { payload: undefined, error: true };
    }
};

export default async function Page({
    searchParams,
}: {
    searchParams: searchParamsPromise;
}) {
    const { email, token } = await searchParams;

    const { payload, error } = await verified(token);

    return (
        <div className="h-screen flex justify-center items-center bg-slate-50">
            <div className="w-[600px] space-y-8 min-h-[400px] border rounded-md flex flex-col justify-center items-center bg-white">
                <div>
                    <h1 className="text-4xl font-bold italic">
                        Clover Auction
                    </h1>
                </div>
                {!error ? (
                    <>
                        <div className="max-w-[500px]">
                            <AlertDestructive />
                        </div>
                        <div>
                            <Button variant={"destructive"}>
                                Resend verify mail
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="max-w-[500px]">
                            <AlertSuccess />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
