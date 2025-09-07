import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glassmorphism p-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              🚀 Ready to build something amazing?
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Start creating your
              <span className="block gradient-text">dream website today</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who have already built stunning
              websites with Lovable. No coding skills required, just your vision
              and our AI-powered platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                className="btn-primary text-lg px-8 py-4 flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                className="btn-secondary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">50K+</div>
            <div className="text-sm text-gray-400">Websites Built</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">1M+</div>
            <div className="text-sm text-gray-400">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">99.9%</div>
            <div className="text-sm text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">24/7</div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
