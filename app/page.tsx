import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Seo } from '@/components/Seo';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Code, BarChart2, Users, Zap, ArrowRight } from 'lucide-react';
import React from "react";

async function getFeatures() {
    return [
        {
            title: "Track Your Progress",
            description: "Log your daily coding achievements and watch your skills grow over time.",
            icon: <Code className="w-8 h-8 text-primary" />,
        },
        {
            title: "Insightful Analytics",
            description: "Visualize your coding journey with powerful charts and statistics.",
            icon: <BarChart2 className="w-8 h-8 text-primary" />,
        },
        {
            title: "Connect with Others",
            description: "Share your journey and learn from fellow developers in our community.",
            icon: <Users className="w-8 h-8 text-primary" />,
        },
        {
            title: "AI-Powered Insights",
            description: "Get personalized suggestions and analytics to improve your coding habits.",
            icon: <Zap className="w-8 h-8 text-primary" />,
        }
    ];
}

async function getStats() {
    const totalUsers = await prisma.user.count();
    const totalEntries = await prisma.entry.count();
    return { totalUsers, totalEntries };
}

async function getTestimonials() {
    return [
        {
            name: "Sarah L.",
            role: "Full Stack Developer",
            content: "ClubDev has revolutionized the way I track my coding progress. The AI insights are incredibly helpful!",
            avatar: "/placeholder.svg?height=100&width=100",
        },
        {
            name: "Michael R.",
            role: "Data Scientist",
            content: "The community aspect of ClubDev is fantastic. I&#39;ve connected with so many like-minded developers!",
            avatar: "/placeholder.svg?height=100&width=100",
        },
        {
            name: "Emily K.",
            role: "Mobile App Developer",
            content: "ClubDev&#39;s analytics have helped me identify areas for improvement in my coding journey.",
            avatar: "/placeholder.svg?height=100&width=100",
        },
    ];
}

const faqs = [
    {
        question: "What is ClubDev?",
        answer: "ClubDev is a platform designed for developers to track their coding journey, connect with peers, and gain valuable insights into their progress. It combines journaling, analytics, AI-powered assistance, and community features to help you become a better programmer."
    },
    {
        question: "How does ClubDev work?",
        answer: "ClubDev provides tools for daily coding logs, progress tracking, and skill development. You can journal your coding activities, view analytics on your progress, get AI-powered suggestions, and interact with other developers. The platform adapts to your needs as you grow."
    },
    {
        question: "Is ClubDev free to use?",
        answer: "ClubDev offers both free and paid plans. The free plan includes basic journaling and community features. Paid plans unlock advanced analytics, AI-powered insights, and additional resources to accelerate your growth as a developer."
    },
    {
        question: "Can I integrate ClubDev with other tools I use?",
        answer: "Yes, ClubDev supports integrations with popular developer tools like GitHub and VS Code. These integrations allow for seamless tracking of your coding activities and projects across different platforms."
    },
    {
        question: "How does ClubDev protect my data and privacy?",
        answer: "We take data protection seriously. ClubDev uses industry-standard encryption and security practices. Your personal data is never shared without your consent, and you have full control over what you share with the community."
    },
    {
        question: "How can I get started with ClubDev?",
        answer: "Getting started is easy! Simply sign up for an account, set up your profile, and begin journaling your coding activities. Explore the various features like analytics and AI assistance, and join our community discussions to connect with other developers."
    }
];

export default async function Home() {
    const features = await getFeatures();
    const stats = await getStats();
    const testimonials = await getTestimonials();
    const session = await getServerSession();

    return (
        <>
            <Seo
                title="ClubDev - Your Coding Journey Starts Here"
                description="Join ClubDev and turn your coding adventures into a beautiful story. Track progress, connect with others, and boost your productivity."
            />
            <div className="container mx-auto px-4 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6 text-foreground">
                        Your Coding Journey<br />Starts with <span className="text-primary">ClubDev</span>
                    </h1>
                    <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of developers who are tracking their progress, connecting with peers, and
                        leveraging AI-powered insights to become better programmers.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button asChild size="lg" className="px-8">
                            <Link href={session ? "/journal" : "/auth/signup"}>
                                {session ? "Start Journaling" : "Join Now"}
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="px-8">
                            <Link href="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-semibold mb-10 text-center text-foreground">Why Choose ClubDev?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={feature.title}>
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            {feature.icon}
                                            <span>{feature.title}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-semibold mb-10 text-center text-foreground">What Our Users Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={testimonial.name}>
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center mb-4">
                                            <img src={testimonial.avatar} alt={testimonial.name}
                                                className="w-12 h-12 rounded-full mr-4" />
                                            <div>
                                                <h3 className="font-semibold">{testimonial.name}</h3>
                                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-semibold mb-10 text-center text-foreground">Frequently Asked
                        Questions</h2>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger
                                        className="text-lg font-medium text-foreground">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-semibold mb-6 text-foreground">Ready to Start Your Coding Journey?</h2>
                    <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                        Join ClubDev today and take your coding skills to the next level with our powerful tools and
                        supportive community.
                    </p>
                    <Button asChild size="lg" className="px-8">
                        <Link href={session ? "/journal" : "/auth/signup"}>
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Stats Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-10 text-foreground">Join Our Growing Community</h2>
                    <div className="flex justify-center space-x-12">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">{stats.totalUsers}</p>
                            <p className="text-xl text-muted-foreground">Developers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">{stats.totalEntries}</p>
                            <p className="text-xl text-muted-foreground">Journal Entries</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}