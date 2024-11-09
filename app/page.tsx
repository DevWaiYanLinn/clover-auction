import Banner from "@/components/custom/banner";
import GuestNavBar from "@/components/custom/guest-nav-bar";

export default async function Home() {
    return (
        <div className="h-screen bg-white space-y-5">
            <GuestNavBar />
            <Banner />
        </div>
    );
}
