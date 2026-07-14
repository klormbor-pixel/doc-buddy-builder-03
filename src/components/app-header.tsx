import { Bell, Search, HelpCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Crumb = { label: string; href?: string };

export function AppHeader({ title, crumbs }: { title: string; crumbs?: Crumb[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex items-baseline gap-2 truncate">
          <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>
          {crumbs && crumbs.length > 0 && (
            <span className="hidden truncate text-xs text-muted-foreground md:inline">
              /{" "}
              {crumbs.map((c, i) => (
                <span key={i}>
                  {c.label}
                  {i < crumbs.length - 1 && " / "}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="relative hidden w-72 md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reports, projects, POs…"
          className="h-9 pl-8 text-sm"
        />
      </div>

      <Button variant="ghost" size="icon" className="h-9 w-9">
        <HelpCircle className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
      </Button>
    </header>
  );
}
