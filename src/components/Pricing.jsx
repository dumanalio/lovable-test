import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out Lovable",
      features: [
        "1 website",
        "Basic templates",
        "Mobile responsive",
        "Community support",
        "Basic analytics",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Best for growing businesses",
      features: [
        "5 websites",
        "Premium templates",
        "Advanced customization",
        "Priority support",
        "Advanced analytics",
        "Custom domain",
        "Remove Lovable branding",
      ],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited websites",
        "White-label solution",
        "Dedicated support",
        "Advanced integrations",
        "Team collaboration",
        "Custom development",
        "SLA guarantee",
      ],
      popular: false,
      cta: "Contact Sales",
    },
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
    <section
      id="pricing"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/20 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            💰 Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Choose your plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core
            features with no hidden fees or surprise charges.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative card group hover:scale-105 transition-all duration-300 ${
                plan.popular ? "ring-2 ring-lovable-400 shadow-2xl" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-lovable-500 to-lovable-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold gradient-text">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300 group-hover:text-gray-200 transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-lovable-500 to-lovable-600 hover:from-lovable-600 hover:to-lovable-700 text-white"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="glassmorphism p-6">
              <h4 className="font-semibold mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="glassmorphism p-6">
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-300">
                We offer a 30-day money-back guarantee on all paid plans. No
                questions asked.
              </p>
            </div>
            <div className="glassmorphism p-6">
              <h4 className="font-semibold mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for
                annual plans.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;
