import { useState } from "react";
import { X, Download, FileText, Table, Presentation, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { SearchResult } from "@shared/schema";

interface ExportModalProps {
  isOpen: boolean;
  results: SearchResult[];
  onClose: () => void;
}

export default function ExportModal({ isOpen, results, onClose }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "pitch">("pdf");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: exportFormat,
          resultIds: results.map(r => r.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create download link
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gapfinder-${exportFormat}-${new Date().toISOString().split('T')[0]}.${exportFormat === 'csv' ? 'csv' : 'html'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Successfully exported ${results.length} results as ${exportFormat.toUpperCase()}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailShare = async () => {
    if (!emailRecipient) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const response = await fetch('/api/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRecipient,
          message: customMessage,
          resultIds: results.map(r => r.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Email failed');
      }
      
      toast({
        title: "Email Sent",
        description: `Gap analysis report sent to ${emailRecipient}`,
      });
      
      setEmailRecipient("");
      setCustomMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-google-gray-dark">Export Results</h2>
              <p className="text-google-gray">Export {results.length} gap analysis results</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="download" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="share">Share via Email</TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value: "pdf" | "csv" | "pitch") => setExportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          PDF Report
                        </div>
                      </SelectItem>
                      <SelectItem value="csv">
                        <div className="flex items-center">
                          <Table className="w-4 h-4 mr-2" />
                          CSV Data
                        </div>
                      </SelectItem>
                      <SelectItem value="pitch">
                        <div className="flex items-center">
                          <Presentation className="w-4 h-4 mr-2" />
                          Pitch Deck
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Export Preview</h3>
                  {exportFormat === "pdf" && (
                    <div className="text-sm text-gray-600">
                      <p>• Professional PDF report with executive summary</p>
                      <p>• Detailed analysis for each opportunity</p>
                      <p>• Market size and feasibility ratings</p>
                      <p>• Action plan recommendations</p>
                    </div>
                  )}
                  {exportFormat === "csv" && (
                    <div className="text-sm text-gray-600">
                      <p>• Structured data for analysis</p>
                      <p>• All opportunity details in spreadsheet format</p>
                      <p>• Sortable and filterable columns</p>
                      <p>• Compatible with Excel and Google Sheets</p>
                    </div>
                  )}
                  {exportFormat === "pitch" && (
                    <div className="text-sm text-gray-600">
                      <p>• Investor-ready presentation slides</p>
                      <p>• Market opportunity highlights</p>
                      <p>• Business model suggestions</p>
                      <p>• Competitive analysis framework</p>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    "Generating..."
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export {exportFormat.toUpperCase()}
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="share" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Recipient Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="investor@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Custom Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Hi, I wanted to share some exciting market opportunities I discovered..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Preview
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>Subject:</strong> Market Gap Analysis Report - {results.length} Opportunities</p>
                    <p><strong>Attachment:</strong> GapFinder_Analysis_Report.pdf</p>
                    <p><strong>Content:</strong> Professional report with opportunity details and action plans</p>
                  </div>
                </div>

                <Button 
                  onClick={handleEmailShare} 
                  disabled={isExporting || !emailRecipient}
                  className="w-full"
                >
                  {isExporting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email Report
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}