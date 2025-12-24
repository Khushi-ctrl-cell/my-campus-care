import { WellBeingRecord } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface StressChartProps {
  data: WellBeingRecord[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const stressLevel = payload[0].value;
    const stressLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    
    return (
      <div className="bg-card px-3 py-2 rounded-lg shadow-lg border border-border">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={cn(
          "text-sm font-semibold",
          stressLevel <= 2 ? "text-success" : 
          stressLevel <= 3 ? "text-warning" : 
          "text-danger"
        )}>
          {stressLabels[stressLevel - 1]}
        </p>
      </div>
    );
  }
  return null;
};

export function StressChart({ data, className }: StressChartProps) {
  const formattedData = data.slice(-6).map(d => ({
    ...d,
    label: format(parseISO(d.date), 'MMM dd'),
  }));

  const latestStress = data[data.length - 1]?.stress || 3;
  const stressLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

  return (
    <div className={cn("p-4 rounded-2xl bg-card soft-shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Stress Level</h3>
        <span className={cn(
          "text-sm font-medium px-3 py-1 rounded-full",
          latestStress <= 2 ? "bg-success/10 text-success" : 
          latestStress <= 3 ? "bg-warning/10 text-warning" : 
          "bg-danger/10 text-danger"
        )}>
          {stressLabels[latestStress - 1]}
        </span>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(45, 93%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(45, 93%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis hide domain={[0, 6]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="stress"
              stroke="hsl(45, 93%, 50%)"
              strokeWidth={2}
              fill="url(#stressGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(45, 93%, 50%)', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Lower is better. Consistent low stress indicates good balance!
      </p>
    </div>
  );
}
