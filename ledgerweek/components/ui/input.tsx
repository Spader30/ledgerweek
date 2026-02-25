import { cn } from '@/lib/utils';
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>){return <input className={cn('h-10 w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 text-sm outline-none focus:border-white/25', className)} {...props}/>}
