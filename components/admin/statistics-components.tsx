import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";


interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden border-border/20 bg-transparent shadow-none", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground/80">
            {title}
          </CardTitle>
          <div className="p-1.5 bg-primary/5 rounded-full text-primary/70">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight tabular-nums">{value}</span>
            {trend && (
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5",
                trend.isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
              )}>
                {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1.5 font-normal">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CircularProgress({
  value,
  label,
  size = 200,
  strokeWidth = 8,
  delay = 0,
}: {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  delay?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/25"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          className="text-primary/80"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          className="text-2xl font-bold tracking-tight tabular-nums"
        >
          {value}%
        </motion.span>
        <span className="text-[10px] font-semibold text-muted-foreground/60 px-4 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

export function HorizontalBars({
  data,
  delay = 0,
}: {
  data: { name: string; value: number; color?: string }[];
  delay?: number;
}) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.name} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-muted-foreground/80">{item.name}</span>
            <span className="font-semibold tabular-nums">{item.value}%</span>
          </div>
          <div className="h-1 w-full bg-muted/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 1, delay: delay + index * 0.1, ease: "circOut" }}
              className={cn("h-full rounded-full", item.color || "bg-primary/80")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({
  data,
  height = 120,
}: {
  data: { month: string; value: number }[];
  height?: number;
}) {
  const config: ChartConfig = {
    value: { label: "Placements", color: "hsl(var(--primary))" },
  }

  return (
    <div style={{ height: `${height}px` }} className="w-full">
      <ChartContainer config={config}>
        <AreaChart
          data={data}
          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="placementTrendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.2)" />
          <XAxis 
            dataKey="month" 
            hide 
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            width={20}
          />
          <ChartTooltip
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#placementTrendGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
