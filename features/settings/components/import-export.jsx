"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportData, importDataFromFile } from "../services/data-io.service";

export function ImportExport({ onImported }) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = () => {
    const { url, filename } = exportData();
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Export downloaded.");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsImporting(true);
    const result = await importDataFromFile(file);
    setIsImporting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Import complete: ${result.videosAdded} video${result.videosAdded === 1 ? "" : "s"} and ${
        result.notesAdded
      } note${result.notesAdded === 1 ? "" : "s"} added.`
    );
    onImported?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import &amp; export</CardTitle>
        <CardDescription>
          Back up your data as JSON, or merge a previous export back in. Imports
          never overwrite existing videos or notes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={handleExport} className="sm:flex-1">
          <Download className="h-4 w-4" />
          Export data
        </Button>
        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isImporting}
          className="sm:flex-1"
        >
          {isImporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isImporting ? "Importing..." : "Import data"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Import JSON file"
        />
      </CardContent>
    </Card>
  );
}
