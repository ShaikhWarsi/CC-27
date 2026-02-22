'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModuleLayoutProps {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
    variant?: 'blue' | 'emerald' | 'amber';
}

export default function ModuleLayout({
    id,
    title,
    description,
    icon: Icon,
    children,
    variant = 'blue'
}: ModuleLayoutProps) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    };

    return (
        <section id={id} className="module-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
            >
                <div className={`inline-flex p-3 rounded-2xl mb-6 ${colors[variant]}`}>
                    <Icon size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">{description}</p>
            </motion.div>
            {children}
        </section>
    );
}
