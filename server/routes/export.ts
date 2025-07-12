import { Request, Response } from "express";
import { storage } from "../storage";

export async function exportResults(req: Request, res: Response) {
  try {
    const { format, resultIds } = req.body;
    
    if (!format || !resultIds || !Array.isArray(resultIds)) {
      return res.status(400).json({ error: "Format and resultIds are required" });
    }

    // Fetch results from storage
    const results = [];
    for (const id of resultIds) {
      const result = await storage.getSearchResultById(id);
      if (result) {
        results.push(result);
      }
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    switch (format) {
      case "csv":
        return exportCsv(results, res);
      case "pdf":
        return exportPdf(results, res);
      case "pitch":
        return exportPitch(results, res);
      default:
        return res.status(400).json({ error: "Invalid format" });
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Export failed" });
  }
}

function exportCsv(results: any[], res: Response) {
  const headers = [
    "Title",
    "Description", 
    "Category",
    "Feasibility",
    "Market Potential",
    "Innovation Score",
    "Market Size",
    "Gap Reason"
  ];

  const csvData = [
    headers.join(","),
    ...results.map(result => [
      `"${result.title}"`,
      `"${result.description}"`,
      `"${result.category}"`,
      result.feasibility,
      result.marketPotential,
      result.innovationScore,
      `"${result.marketSize}"`,
      `"${result.gapReason}"`
    ].join(","))
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=gapfinder-results.csv");
  res.send(csvData);
}

function exportPdf(results: any[], res: Response) {
  // In a real implementation, you would use a PDF library like puppeteer or PDFKit
  // For now, we'll return a simple HTML response that can be printed as PDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GapFinder Analysis Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .result { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; }
        .title { font-size: 18px; font-weight: bold; color: #333; }
        .category { color: #666; font-size: 14px; }
        .description { margin: 10px 0; }
        .metrics { display: flex; gap: 20px; margin: 10px 0; }
        .metric { background: #f5f5f5; padding: 8px 12px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>GapFinder Market Analysis Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        <p>${results.length} Opportunities Identified</p>
      </div>
      
      ${results.map(result => `
        <div class="result">
          <div class="title">${result.title}</div>
          <div class="category">${result.category}</div>
          <div class="description">${result.description}</div>
          <div class="metrics">
            <div class="metric">Feasibility: ${result.feasibility}</div>
            <div class="metric">Market Potential: ${result.marketPotential}</div>
            <div class="metric">Innovation Score: ${result.innovationScore}/10</div>
            <div class="metric">Market Size: ${result.marketSize}</div>
          </div>
          <div><strong>Gap Reason:</strong> ${result.gapReason}</div>
        </div>
      `).join("")}
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Disposition", "attachment; filename=gapfinder-report.html");
  res.send(html);
}

function exportPitch(results: any[], res: Response) {
  // Simple pitch deck template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Market Opportunity Pitch Deck</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        .slide { width: 100vw; height: 100vh; padding: 80px; box-sizing: border-box; page-break-after: always; }
        .title-slide { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; display: flex; flex-direction: column; justify-content: center; }
        .content-slide { background: white; }
        h1 { font-size: 48px; margin-bottom: 20px; }
        h2 { font-size: 36px; margin-bottom: 30px; }
        h3 { font-size: 24px; margin-bottom: 20px; }
        .opportunity { margin-bottom: 40px; padding: 30px; background: #f8f9fa; border-radius: 8px; }
        .metrics { display: flex; gap: 30px; margin: 20px 0; }
        .metric { text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
        .metric-label { font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="slide title-slide">
        <h1>Market Opportunity Analysis</h1>
        <p style="font-size: 24px;">${results.length} High-Impact Opportunities</p>
        <p style="font-size: 18px;">Generated by GapFinder</p>
      </div>
      
      ${results.map((result, index) => `
        <div class="slide content-slide">
          <h2>Opportunity ${index + 1}: ${result.title}</h2>
          <div class="opportunity">
            <h3>Market Gap</h3>
            <p style="font-size: 18px;">${result.description}</p>
            
            <div class="metrics">
              <div class="metric">
                <div class="metric-value">${result.feasibility}</div>
                <div class="metric-label">Feasibility</div>
              </div>
              <div class="metric">
                <div class="metric-value">${result.marketPotential}</div>
                <div class="metric-label">Market Potential</div>
              </div>
              <div class="metric">
                <div class="metric-value">${result.innovationScore}/10</div>
                <div class="metric-label">Innovation Score</div>
              </div>
            </div>
            
            <h3>Why This Gap Exists</h3>
            <p>${result.gapReason}</p>
            
            <h3>Market Size</h3>
            <p style="font-size: 20px; font-weight: bold; color: #667eea;">${result.marketSize}</p>
          </div>
        </div>
      `).join("")}
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Disposition", "attachment; filename=pitch-deck.html");
  res.send(html);
}

export async function sendEmailReport(req: Request, res: Response) {
  try {
    const { email, message, resultIds } = req.body;
    
    if (!email || !resultIds || !Array.isArray(resultIds)) {
      return res.status(400).json({ error: "Email and resultIds are required" });
    }

    // In a real implementation, you would use a service like SendGrid, Mailgun, etc.
    // For now, we'll simulate the email sending
    console.log(`Sending email to ${email} with ${resultIds.length} results`);
    console.log(`Custom message: ${message}`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
}