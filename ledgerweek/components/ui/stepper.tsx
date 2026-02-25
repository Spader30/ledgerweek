import { Badge } from './badge';
export function Stepper({ steps, active }:{steps:string[];active:number}){return <div className='flex flex-wrap items-center gap-2'>{steps.map((s,i)=>(<Badge key={s} tone={i===active?'good':'neutral'}>{i+1}. {s}</Badge>))}</div>}
