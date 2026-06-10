'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, Wifi, Activity, Zap, RefreshCw, Plus, Globe, ShieldCheck, Database, Server, Radar, Router, Terminal } from 'lucide-react';
import { useUser } from '@/firebase';

const devices = [
  { id: 'iot-1', name: 'Kitchen Sensor Cluster', type: 'ESP32 Node', status: 'online', load: '12%', data: '24.2°C', lastSync: '2s ago' },
  { id: 'iot-2', name: 'HVAC Master Controller', type: 'RaspberryPi 4', status: 'online', load: '42%', data: 'Grid Opt.', lastSync: '1s ago' },
  { id: 'iot-3', name: 'Main Water Inflow Node', type: 'MQTT Gate', status: 'offline', load: '0%', data: 'N/A', lastSync: '5m ago' },
  { id: 'iot-4', name: 'Living Area Humidity', type: 'Arduino Nano', status: 'online', load: '5%', data: '48%', lastSync: '3s ago' },
];

export default function IoTManagerPage() {
  const { user } = useUser();

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Hardware Mesh</h1>
          <p className="text-muted-foreground font-medium text-lg italic">Enterprise IoT telemetry and multi-layer device orchestration hub.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[10px] gap-3">
            <RefreshCw className="h-4 w-4 animate-spin-slow" /> Rescan Network
          </Button>
          <Button className="h-16 px-12 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl tesla-shadow">
            <Plus className="mr-3 h-5 w-5" /> Provision Node
          </Button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-4">
        {[
          { label: "Mesh Latency", value: "14ms", icon: Globe, color: "text-primary", bg: "bg-primary/10" },
          { label: "Active Nodes", value: "32", icon: Wifi, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Secure Protocol", value: "TLS 1.3", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Telemetry Stream", value: "1.2 GB/d", icon: Terminal, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-none rounded-[3rem] p-10 flex items-center gap-8 group tesla-shadow">
               <div className={`h-16 w-16 rounded-[1.5rem] ${stat.bg} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">{stat.label}</p>
                  <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {devices.map((device, idx) => (
          <motion.div key={device.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
             <Card className="glass-card border-none rounded-[4rem] overflow-hidden group tesla-shadow">
                <CardHeader className="p-12 flex flex-row items-center justify-between border-b border-white/5">
                   <div className="flex items-center gap-8">
                      <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all">
                         <Server className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                         <CardTitle className="text-3xl font-black italic uppercase tracking-tighter leading-none">{device.name}</CardTitle>
                         <div className="flex items-center gap-4">
                            <Badge className="bg-white/10 text-[9px] font-black uppercase tracking-widest border-white/10 px-3 py-1">{device.type}</Badge>
                            <div className="flex items-center gap-2">
                               <div className={`h-2 w-2 rounded-full ${device.status === 'online' ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-destructive'}`} />
                               <span className={`text-[10px] font-black uppercase tracking-widest ${device.status === 'online' ? 'text-primary' : 'text-destructive'}`}>
                                  {device.status}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border-white/10 hover:text-primary transition-all"><Terminal className="h-5 w-5" /></Button>
                      <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border-white/10 hover:text-primary transition-all"><Radar className="h-5 w-5" /></Button>
                   </div>
                </CardHeader>
                <CardContent className="p-12 grid grid-cols-3 gap-10">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">MCU LOAD</p>
                      <p className="text-3xl font-black italic">{device.load}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">REAL-TIME DATA</p>
                      <p className="text-3xl font-black italic text-primary">{device.data}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">HEARTBEAT</p>
                      <p className="text-sm font-bold opacity-60 flex items-center gap-2">
                         <RefreshCw className="h-3 w-3" /> {device.lastSync}
                      </p>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
