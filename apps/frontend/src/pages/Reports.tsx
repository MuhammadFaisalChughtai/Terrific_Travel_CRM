import { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (type: string) => {
    setDownloading(type);
    toast.loading(`Compiling ${type} ledger analytics...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${type} report generated and downloaded successfully.`);
      setDownloading(null);
    }, 2000);
  };

  const reportsList = [
    { name: 'Monthly Financial Ledger', desc: 'Detailed breakdown of booking commissions, gross payouts, and tax fees.', format: 'CSV', icon: FileSpreadsheet },
    { name: 'Capacity & Load Factor', desc: 'Seat occupancy trends across active flight carriers and destination segments.', format: 'PDF', icon: FileText },
    { name: 'Customer Satisfaction Score', desc: 'Hotel ratings, room feedback, and agent performance reviews.', format: 'PDF', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <h3 className="text-base font-bold flex items-center gap-2">
          <BarChart3 size={20} className="text-primary" />
          Export Operations Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsList.map((rep) => {
            const Icon = rep.icon;
            return (
              <div key={rep.name} className="p-6 bg-secondary/15 border border-border rounded-xl flex flex-col justify-between gap-6 hover:border-primary/20 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                      {rep.format}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug">{rep.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rep.desc}</p>
                </div>

                <button
                  onClick={() => handleDownload(rep.name)}
                  disabled={downloading !== null}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download size={14} />
                  {downloading === rep.name ? 'Generating...' : 'Export Document'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit reports log */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Historical Compilation log</h4>
        <div className="space-y-2">
          <div className="p-3 bg-secondary/35 border border-border rounded-lg flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              Monthly Financial Ledger_2026-06.csv
            </span>
            <span className="text-muted-foreground">Downloaded by Admin today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
