import { motion } from 'framer-motion';
import { Zap, Palette, Code, Rocket, Heart, Star, Sparkles, Target } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Build websites in minutes, not hours. Our AI does the heavy lifting so you can focus on what matters.",
      color: "text-yellow-400"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Beautiful Designs",
      description: "Choose from hundreds of professionally designed templates or create something completely unique.",
      color: "text-pink-400"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "No Code Required",
      description: "You don't need to know how to code. Our intuitive interface makes building websites accessible to everyone.",
      color: "text-blue-400"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "SEO Optimized",
      description: "Every website we create is optimized for search engines, helping you get found online.",
      color: "text-green-400"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Mobile First",
      description: "Your website will look amazing on all devices, from phones to tablets to desktops.",
      color: "text-red-400"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Our friendly support team is always here to help you succeed with your website.",
      color: "text-purple-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            ✨ Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Everything you need to
            <span className="block gradient-text">build amazing websites</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our platform combines the power of AI with intuitive design tools to help you create
            professional websites that convert visitors into customers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glassmorphism p-8 max-w-4xl mx-auto">
            <Target className="w-16 h-16 text-lovable-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Join thousands of creators who have already built their dream websites with Lovable.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Start Your Project
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
