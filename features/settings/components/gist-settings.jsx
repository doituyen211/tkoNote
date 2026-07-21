"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Cloud, CloudOff, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGistSync } from "@/hooks/use-gist-sync";

const STATUS_CONFIG = {
  idle: { icon: CloudOff, color: "text-muted-foreground", label: "Not connected" },
  syncing: { icon: Loader2, color: "text-primary", label: "Syncing..." },
  synced: { icon: CheckCircle2, color: "text-success", label: "Synced" },
  error: { icon: AlertCircle, color: "text-error", label: "Sync error" },
};

export function GistSettings() {
  const { isConnected, status, username, connect, disconnect, retry, pullFromGist } =
    useGistSync();
  const [tokenInput, setTokenInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const StatusIcon = statusInfo.icon;

  const handleConnect = async () => {
    if (!tokenInput.trim()) return;
    setIsConnecting(true);
    try {
      const user = await connect(tokenInput.trim());
      toast.success(`Connected as @${user}`);
      setTokenInput("");
    } catch (err) {
      toast.error(err.message || "Invalid token. Check that it has gist scope.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Cloud sync disconnected.");
  };

  const handlePull = async () => {
    await pullFromGist();
    toast.success("Data synced from cloud.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          Cloud Sync
        </CardTitle>
        <CardDescription>
          Sync your notes and videos across devices via a private GitHub Gist.
          Requires a free GitHub account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <StatusIcon
                className={`h-4 w-4 ${statusInfo.color} ${status === "syncing" ? "animate-spin" : ""}`}
              />
              <span className={statusInfo.color}>{statusInfo.label}</span>
              {username && (
                <span className="text-muted-foreground">· @{username}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePull}>
                <RefreshCw className="h-3.5 w-3.5" />
                Pull now
              </Button>
              {status === "error" && (
                <Button variant="outline" size="sm" onClick={retry}>
                  Retry
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <CloudOff className="h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              1. Go to{" "}
              <a
                href="https://github.com/settings/tokens/new?scopes=gist&description=learnboard-sync"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                github.com/settings/tokens/new
              </a>{" "}
              and create a token with <strong>gist</strong> scope.
            </p>
            <p className="text-xs text-muted-foreground">
              2. Paste the token below:
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showToken ? "text" : "password"}
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                  className="pr-16 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              <Button
                onClick={handleConnect}
                disabled={!tokenInput.trim() || isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Your token stays in this browser only and is never stored on a server.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
