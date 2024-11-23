import Banner from "@/components/custom/banner";
import GuestNavBar from "@/components/custom/guest-nav-bar";

export default async function Home() {
    return (
        <div className="h-screen bg-white space-y-5">
            <GuestNavBar />
            <Banner />
            <div className={"bg-slate-50 p-5"}>
                <h2 className="text-3xl text-center">
                    You can choice various Categories
                </h2>
            </div>
        </div>
    );
}
