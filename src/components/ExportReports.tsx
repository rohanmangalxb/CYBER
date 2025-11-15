import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExportReportsProps {
  threats: any[];
}

export const ExportReports = ({ threats }: ExportReportsProps) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('csv');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);

  const filterThreats = () => {
    let filtered = [...threats];

    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.detected_at) >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.detected_at) <= dateTo);
    }
    if (severityFilter !== 'all') {
      filtered = filtered.filter(t => t.threat_level === severityFilter);
    }

    return filtered;
  };

  const exportToCSV = (data: any[]) => {
    const headers = ['ID', 'Timestamp', 'Country', 'Attacker IP', 'Target IP', 'Attack Type', 'Severity', 'Blocked', 'Location'];
    const rows = data.map(t => [
      t.id,
      format(new Date(t.detected_at), 'yyyy-MM-dd HH:mm:ss'),
      t.country,
      t.attacker_ip,
      t.target_system,
      t.attack_type,
      t.threat_level,
      t.blocked ? 'Yes' : 'No',
      `${t.latitude}, ${t.longitude}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  const exportToJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  const exportToPDF = async (data: any[]) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #ef4444; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1e293b; color: white; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .critical { color: #ef4444; font-weight: bold; }
            .high { color: #f97316; font-weight: bold; }
            .medium { color: #eab308; font-weight: bold; }
            .low { color: #22c55e; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Cyber Threat Report</h1>
          <p><strong>Generated:</strong> ${format(new Date(), 'PPpp')}</p>
          <p><strong>Total Threats:</strong> ${data.length}</p>
          ${dateFrom ? `<p><strong>From:</strong> ${format(dateFrom, 'PP')}</p>` : ''}
          ${dateTo ? `<p><strong>To:</strong> ${format(dateTo, 'PP')}</p>` : ''}
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Country</th>
                <th>Attacker IP</th>
                <th>Attack Type</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(t => `
                <tr>
                  <td>${format(new Date(t.detected_at), 'PPpp')}</td>
                  <td>${t.country}</td>
                  <td>${t.attacker_ip}</td>
                  <td>${t.attack_type}</td>
                  <td class="${t.threat_level.toLowerCase()}">${t.threat_level}</td>
                  <td>${t.blocked ? 'Blocked' : 'Active'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
    a.click();

    toast({
      title: "PDF Export",
      description: "HTML file exported. Open it in a browser and use Print to PDF feature.",
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filteredData = filterThreats();

      if (filteredData.length === 0) {
        toast({
          title: "No Data",
          description: "No threats match the selected filters.",
          variant: "destructive",
        });
        return;
      }

      // Log export action to audit logs
      await supabase.from('audit_logs').insert([{
        action: 'export_report',
        resource_type: 'threats',
        details: {
          format: exportFormat,
          count: filteredData.length,
          filters: { 
            dateFrom: dateFrom?.toISOString(), 
            dateTo: dateTo?.toISOString(), 
            severityFilter 
          }
        }
      }]);

      switch (exportFormat) {
        case 'csv':
          exportToCSV(filteredData);
          break;
        case 'json':
          exportToJSON(filteredData);
          break;
        case 'pdf':
          await exportToPDF(filteredData);
          break;
      }

      toast({
        title: "Export Successful",
        description: `${filteredData.length} threats exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the report.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Export Threat Reports</CardTitle>
        <CardDescription className="text-muted-foreground">
          Download threat data in various formats with customizable filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="pdf">PDF (HTML)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Severity Filter</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date From</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date To</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {filterThreats().length} threats will be exported
          </div>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};