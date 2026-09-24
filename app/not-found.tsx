import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">页面不存在。</p>
      <Link href="/" className="mt-6 inline-block underline underline-offset-4">回到首页</Link>
    </div>
  );
}
