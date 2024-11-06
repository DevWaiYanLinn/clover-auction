export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-5 bg-slate-50 h-screen flex flex-col">{children}</div>
    );
}
