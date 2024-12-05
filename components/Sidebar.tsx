'use client'


import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {ScrollArea} from '@/components/ui/scroll-area'
import {Home, BookOpen, BarChart2, Users, Code, Map, User} from 'lucide-react'
import {SubscriptionStatus} from '@/components/SubscriptionStatus';

import React from "react";

const sidebarItems = [
    {name: 'Home', href: '/', icon: Home},
    {name: 'Journal', href: '/journal', icon: BookOpen},
    {name: 'Analytics', href: '/analytics', icon: BarChart2},
    {name: 'Feed', href: '/feed', icon: Users},
    {name: 'Code Assistant', href: '/code-assistant', icon: Code},
    {name: 'Mind Map', href: '/mindmap', icon: Map},
    {name: 'Profile', href: '/profile', icon: User},
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="pb-12 w-64">
            <ScrollArea className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Navigation
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start',
                                    pathname === item.href && 'bg-muted font-semibold'
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4"/>
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
            <SubscriptionStatus/>
        </div>
    )
}