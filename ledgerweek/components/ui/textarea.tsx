import { cn } from '@/lib/utils';
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={cn('min-h-[90px] w-full rounded-xl border border-white/10 bg-[#0B1020] px-3 py-2 text-sm outline-none focus:border-white/25', className)} {...props}/>}
