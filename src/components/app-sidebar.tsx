import { useState } from "react";
import { Kanban, Calendar, BarChart3, Sun } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { 
    title: "Gestão de Leads", 
    url: "/", 
    icon: Kanban,
    description: "Kanban de Vendas"
  },
  { 
    title: "Planejamento", 
    url: "/planejamento", 
    icon: Calendar,
    description: "Organização Semanal"
  },
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: BarChart3,
    description: "KPIs e Relatórios"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavCls = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-primary text-primary-foreground shadow-md" 
      : "hover:bg-secondary/50 text-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Header da VIA SOLAR */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sun className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-primary">VIA SOLAR</h2>
                <p className="text-xs text-muted-foreground">Controle Comercial</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {!collapsed ? "Menu Principal" : ""}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col gap-0">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status do vendedor */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="bg-primary-light/20 rounded-lg p-3">
              <h4 className="text-sm font-medium text-primary mb-1">Vendedor Externo</h4>
              <p className="text-xs text-muted-foreground">Status: Ativo</p>
              <div className="mt-2 h-1 bg-secondary rounded-full">
                <div className="h-1 bg-gradient-primary rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Meta semanal: 75%</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}