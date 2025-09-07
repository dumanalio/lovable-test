import { motion } from 'framer-motion';
import { ArrowRight, Upload, Wand2, Rocket, CheckCircle } from 'lucide-react';

function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "1. Tell us your vision",
      description: "Describe your website idea, target audience, and goals. Our AI will understand your vision perfectly.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "2. AI creates your site",
      description: "Watch as our advanced AI generates a beautiful, professional website tailored to your needs.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "3. Customize & perfect",
      description: "Make any adjustments you want. Change colors, add content, or modify the layout with our easy editor.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "4. Launch & grow",
      description: "Publish your website instantly and start growing your online presence with built-in SEO and analytics.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            How it works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Creating a professional website has never been easier. Follow these simple steps
            and watch your vision come to life in minutes.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="relative h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-lovable-400 to-lovable-600 origin-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="relative mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-6 h-6 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glassmorphism p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to build your website?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of creators who have already transformed their ideas into beautiful websites.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Start Building Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
