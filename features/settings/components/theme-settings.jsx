"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export function ThemeSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose light, dark, or match your system setting. Your choice is saved
          for next time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeToggle />
      </CardContent>
    </Card>
  );
}
