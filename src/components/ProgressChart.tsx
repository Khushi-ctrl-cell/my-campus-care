import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  title: string;
  data: DataPoint[];
  color: 'primary' | 'success' | 'warning' | 'lavender';
  suffix?: string;
  className?: string;
}

const colorMap = {
  primary: {
    stroke: 'hsl(217, 91%, 60%)',
    fill: 'hsl(217, 91%, 60%)',
    gradient: ['hsl(217, 91%, 60%)', 'hsl(217, 91%, 90%)'],
  },
  success: {
    stroke: 'hsl(152, 60%, 50%)',
    fill: 'hsl(152, 60%, 50%)',
    gradient: ['hsl(152, 60%, 50%)', 'hsl(152, 60%, 90%)'],
  },
  warning: {
    stroke: 'hsl(45, 93%, 60%)',
    fill: 'hsl(45, 93%, 60%)',
    gradient: ['hsl(45, 93%, 60%)', 'hsl(45, 93%, 90%)'],
  },
  lavender: {
    stroke: 'hsl(270, 50%, 60%)',
    fill: 'hsl(270, 50%, 60%)',
    gradient: ['hsl(270, 50%, 60%)', 'hsl(270, 50%, 90%)'],
  },
};

const CustomTooltip = ({ active, payload, label, suffix }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card px-3 py-2 rounded-lg shadow-lg border border-border">
        <p className="text-xs text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">
          {payload[0].value}{suffix}
        </p>
      </div>
    );
  }
  return null;
};

export function ProgressChart({ title, data, color, suffix = '', className }: ProgressChartProps) {
  const colors = colorMap[color];
  const formattedData = data.map(d => ({
    ...d,
    label: format(parseISO(d.date), 'MMM dd'),
  }));

  const latestValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || latestValue;
  const change = latestValue - previousValue;
  const changePercent = previousValue ? Math.round((change / previousValue) * 100) : 0;

  return (
    <div className={cn("p-4 rounded-2xl bg-card soft-shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {latestValue}{suffix}
          </span>
          {change !== 0 && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              change > 0 
                ? "bg-success/10 text-success" 
                : "bg-danger/10 text-danger"
            )}>
              {change > 0 ? '+' : ''}{changePercent}%
            </span>
          )}
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.fill} stopOpacity={0.3} />
                <stop offset="100%" stopColor={colors.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip content={<CustomTooltip suffix={suffix} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
              dot={false}
              activeDot={{ r: 4, fill: colors.fill, stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
