"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center pt-20 pb-12 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-gray-900">
                Building Skills.
                <br />
                <span className="text-purple-600">Creating Technology.</span>
                <br />
                Empowering Careers.
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-xl">
                MSSquare Technologies is at the forefront of EdTech and Tech Consulting, dedicated to shaping the next generation of tech leaders.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square w-full max-w-md group">
                <img
                  src="/assets/aboutus.jpg"
                  alt="About MSSquare Team"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-transparent pointer-events-none" />
              </div>
              {/* Decorative background blur elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-40 -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40 -z-10" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Who We Are Section */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-4">
                Discovery
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We are a modern technology hub focused on bridging the gap between academic learning and industry requirements. Our mission is to provide accessible, high-quality technical education while delivering cutting-edge consulting services to global enterprises.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With a team of industry veterans and academic experts, we create an ecosystem where innovation thrives and talent is nurtured to its fullest potential.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-lg h-80">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                  alt="MSSquare Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl font-bold text-gray-900">Our Purpose</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  🚩
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-purple-100 leading-relaxed text-sm">
                To empower every individual and organization through transformative tech education and innovative consulting solutions that drive real-world impact and sustainable growth in the digital era.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-3xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  ◉
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                To become the global leader in technology training and digital innovation, creating a world where high-end technical skills are accessible to everyone, regardless of their background.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: "5,000+", label: "Students Trained" },
              { number: "40+", label: "Courses Offered" },
              { number: "120+", label: "Projects Delivered" },
              { number: "25+", label: "Industry Mentors" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gray-50 rounded-2xl"
              >
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-gray-600 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-lg h-80">
                <img
                  src="/assets/blog/ceo.png"
                  alt="Pagidipalli Sai Santosh"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-4">
                Our Leadership
              </p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Message from the Founder
              </h2>

              <blockquote className="text-base text-gray-700 italic mb-6 border-l-4 border-purple-600 pl-6 leading-relaxed">
                "At MSSquare, we don't just teach technology; we cultivate the mindset required to thrive in a constantly evolving digital landscape. Our commitment is to ensure that no aspiring talent is left behind due to a lack of guidance or practical exposure. We are building the architects of tomorrow."
              </blockquote>

              <div>
                <p className="font-bold text-gray-900">Pagidipalli Sai Santosh</p>
                <p className="text-purple-600 font-semibold text-sm">Founder & CEO, MSSquare Technologies</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl mx-4 md:mx-8 mb-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start Your Journey with MSSquare Technologies
            </h2>
            <p className="text-base text-purple-100 mb-6">
              Join a community of learners and innovators building the future.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/courses">
                <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all">
                  Explore Courses
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2">
                  Partner With Us
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
