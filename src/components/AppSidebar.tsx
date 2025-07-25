import React from "react"
import { 
  Tractor, 
  Building2, 
  Truck, 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Settings,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const farmerItems = [
  { title: "Dashboard", url: "/farmer", icon: BarChart3 },
  { title: "My Crops", url: "/farmer/crops", icon: Package },
  { title: "Marketplace", url: "/farmer/marketplace", icon: ShoppingCart },
  { title: "Profile", url: "/farmer/profile", icon: User },
]

const buyerItems = [
  { title: "Dashboard", url: "/buyer", icon: BarChart3 },
  { title: "Post Demand", url: "/buyer/demand", icon: ShoppingCart },
  { title: "Contracts", url: "/buyer/contracts", icon: Package },
  { title: "Suppliers", url: "/buyer/suppliers", icon: User },
]

const logisticsItems = [
  { title: "Dashboard", url: "/logistics", icon: BarChart3 },
  { title: "Services", url: "/logistics/services", icon: Truck },
  { title: "Bookings", url: "/logistics/bookings", icon: Package },
  { title: "Ratings", url: "/logistics/ratings", icon: User },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"

  // Determine current persona based on route
  const currentPersona = currentPath.startsWith('/farmer') ? 'farmer' : 
                        currentPath.startsWith('/buyer') ? 'buyer' : 
                        currentPath.startsWith('/logistics') ? 'logistics' : 'default'

  const items = currentPersona === 'farmer' ? farmerItems :
                currentPersona === 'buyer' ? buyerItems :
                currentPersona === 'logistics' ? logisticsItems : []

  const personaIcon = currentPersona === 'farmer' ? Tractor :
                     currentPersona === 'buyer' ? Building2 :
                     currentPersona === 'logistics' ? Truck : User

  const personaTitle = currentPersona === 'farmer' ? 'Farmer Portal' :
                      currentPersona === 'buyer' ? 'Buyer Portal' :
                      currentPersona === 'logistics' ? 'Logistics Portal' : 'AgriLink360'

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarContent>
        {/* Persona Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            {React.createElement(personaIcon, { className: "h-6 w-6 text-primary" })}
            {!collapsed && (
              <div>
                <h2 className="text-lg font-semibold">{personaTitle}</h2>
                <p className="text-sm text-muted-foreground">AgriLink360</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Persona Switch */}
        <SidebarGroup>
          <SidebarGroupLabel>Switch Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/farmer" className={getNavCls}>
                    <Tractor className="h-4 w-4" />
                    {!collapsed && <span>Farmer</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/buyer" className={getNavCls}>
                    <Building2 className="h-4 w-4" />
                    {!collapsed && <span>Buyer</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/logistics" className={getNavCls}>
                    <Truck className="h-4 w-4" />
                    {!collapsed && <span>Logistics</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}