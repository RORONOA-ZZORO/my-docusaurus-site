import React, { useState, useEffect } from 'react';

const quotesByPath = {
    frontend: [
        { text: "Your computer is a window to your imagination. Code is the glass that lets you see it clearly.", author: "Modern Dev Pro" },
        { text: "The web is the ultimate canvas for your creativity. Every pixel you place tells a story to millions.", author: "Creative Coder" },
        { text: "Design is not just what it looks like, it’s how it works. On the frontend, you are the architect of that feeling.", author: "UX Visionary" },
        { text: "Building for the web means building for everyone. Your craft is the bridge between technology and humanity.", author: "Web Advocate" }
    ],
    backend: [
        { text: "The best systems are invisible. When everything works perfectly, people don't notice the backend—they notice the magic.", author: "Systems Lead" },
        { text: "Scalability is the art of building for the world while starting in a garage. Logic is your strongest tool.", author: "Cloud Architect" },
        { text: "Data is the lifeblood of the modern world. Your job is to build the heart that keeps it pumping flawlessly.", author: "Data Architect" },
        { text: "Stability isn't a feature; it's a foundation. Without a solid backend, the most beautiful interface is just a hollow shell.", author: "Reliability Engineer" }
    ],
    fullstack: [
        { text: "Master of one is good, but master of the entire stack is where you find the power to build anything you can imagine.", author: "Fullstack Guru" },
        { text: "Being a fullstack dev is like being a chef and an architect at the same time. You know how it tastes and how it stands.", author: "Product Builder" },
        { text: "The gap between an idea and a product is filled by the versatility of a developer who understands every layer.", author: "Startup Founder" },
        { text: "Technology is a puzzle, and fullstack developers are the ones who can see the whole picture before the first piece is placed.", author: "Tech Lead" }
    ],
    'data-science': [
        { text: "Data are just summaries of thousands of stories. Your job is to find the one that changes everything and act on it.", author: "Insights Ninja" },
        { text: "In a world drowning in information, the data scientist is the one who can find the signal in the noise.", author: "Decision Analyst" },
        { text: "Numbers have a language of their own. If you listen closely enough, they will tell you exactly where the future is heading.", author: "Data Storyteller" },
        { text: "Knowledge is power, but data-driven insight is the compass that directs that power to where it matters most.", author: "Strategy Pro" }
    ],
    'ai-ml': [
        { text: "The question isn't whether computers can think, but whether they can learn to help us think better and solve the unsolvable.", author: "AI Visionary" },
        { text: "Machine learning is the last invention humanity will ever need to make. We are training the future, one epoch at a time.", author: "Neural Architect" },
        { text: "AI is the new electricity. It will transform every industry and change how we live, work, and connect forever.", author: "Andrew Ng" },
        { text: "Algorithms are the new laws of nature. In AI, you are the one defining those laws to create tomorrow's reality.", author: "ML Researcher" }
    ],
    cybersecurity: [
        { text: "Security is not a product you buy, but a mindset you live. In this field, your curiosity is your greatest defense.", author: "SecOps Pro" },
        { text: "Hackers find a way because they think outside the box. Great defenders build a better box that anticipates the impossible.", author: "White Hat Lead" },
        { text: "The digital world is vast and vulnerable. You are the guardian at the gates, protecting the privacy and safety of everyone.", author: "Digital Sentinel" },
        { text: "In cybersecurity, you don't just solve problems; you stay three steps ahead of the people who haven't even thought of them yet.", author: "Security Architect" }
    ],
    'cloud-devops': [
        { text: "Automation is not just about speed; it's about reliability and the peace of mind that comes with knowing things just work.", author: "DevOps Engineer" },
        { text: "The cloud is the ultimate leveler. It gives a single developer the power to scale their ideas to reach billions of people.", author: "Infrastructure Pro" },
        { text: "Ship fast, fail fast, and fix even faster. In DevOps, your pipeline is the pulse of the entire engineering organization.", author: "SRE Lead" },
        { text: "Infrastructure as code means your creativity is no longer limited by hardware. The world is your server farm.", author: "Cloud Architect" }
    ],
    networking: [
        { text: "Networking is the glue of the modern world. Without the digital highways you build, every innovation would be an island.", author: "Connectivity Guru" },
        { text: "Packets don't lie, but they do tell secrets. Understanding the flow of data is the key to unlocking the entire internet.", author: "Network Legend" },
        { text: "The internet is a living, breathing ecosystem. You are the one ensuring that every heartbeat of data reaches its destination.", author: "Protocol Master" },
        { text: "Connection is the most basic human need in the digital age. You aren't just managing routers; you're connecting people.", author: "NetEng Lead" }
    ],
    'mobile-dev': [
        { text: "The mobile phone is the remote control for our lives. When you build an app, you're building a tool people use every single day.", author: "Mobile Pro" },
        { text: "Great mobile apps aren't just software; they're companions. They need to be fast, beautiful, and feel like they belongs in a pocket.", author: "App Visionary" },
        { text: "The best interface is the one that disappears. On mobile, you are designing for a world that moves as fast as a swipe.", author: "UX Mobile Lead" },
        { text: "Mobile development is the art of fitting infinite possibilities into a palm-sized device that changes the world.", author: "Creator" }
    ],
    'ui-ux': [
        { text: "Good design is obvious. Great design is transparent. You'll know it's working when users don't have to think at all.", author: "UI Master" },
        { text: "Design is not just about beauty; it's about empathy. You are the advocate for every user who ever felt lost in technology.", author: "UX Strategist" },
        { text: "Visual language is the only global language. Your designs speak to eyes and hearts before a single word is read.", author: "Creative Director" },
        { text: "A user interface is like a joke. If you have to explain it, it’s not that good. Build things that speak for themselves.", author: "Design Pro" }
    ]
};

export default function DynamicQuote({ path }) {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const quotes = quotesByPath[path] || quotesByPath['frontend'];
        const storageKey = `last_quote_idx_${path}`;

        // Get last index from sessionStorage to avoid repeats in same session
        const lastIdx = parseInt(sessionStorage.getItem(storageKey));

        let nextIdx;
        if (quotes.length > 1) {
            do {
                nextIdx = Math.floor(Math.random() * quotes.length);
            } while (nextIdx === lastIdx);
        } else {
            nextIdx = 0;
        }

        sessionStorage.setItem(storageKey, nextIdx.toString());
        setQuote(quotes[nextIdx]);
    }, [path]);

    if (!quote) return null;

    return (
        <div className="alert alert--info margin-bottom--lg shadow--md" style={{
            borderLeft: '8px solid var(--ifm-color-primary)',
            backgroundColor: 'var(--ifm-color-emphasis-100)',
            padding: '24px'
        }}>
            <div style={{
                fontStyle: 'italic',
                fontSize: '1.3rem',
                lineHeight: '1.6',
                marginBottom: '15px',
                color: 'var(--ifm-font-color-base)'
            }}>
                "{quote.text}"
            </div>
            <div style={{
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--ifm-color-primary)'
            }}>
                — {quote.author}
            </div>
        </div>
    );
}
