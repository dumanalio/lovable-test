import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      company: "Sarah's Bakery",
      content: "Lovable transformed my small bakery business. I went from having no online presence to a beautiful website that attracts customers every day. The AI understood exactly what I needed!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      company: "Design Studio",
      content: "As a designer, I'm picky about aesthetics. Lovable exceeded my expectations. The templates are gorgeous and the customization options are incredible. My portfolio has never looked better.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Restaurant Owner",
      company: "Bella Vista",
      content: "I had zero technical skills, but Lovable made it so easy. My restaurant's website now showcases our menu beautifully and we've seen a 40% increase in reservations. Amazing!",
      rating: 5,
      avatar: "ER"
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      company: "TechFlow",
      content: "We needed a professional website fast for our product launch. Lovable delivered in hours what would have taken weeks with traditional development. The ROI has been incredible.",
      rating: 5,
      avatar: "DK"
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director",
      company: "Global Corp",
      content: "Our marketing team loves how quickly we can create landing pages for campaigns. The AI suggestions are spot-on and the results speak for themselves. Highly recommended!",
      rating: 5,
      avatar: "LT"
    },
    {
      name: "James Wilson",
      role: "E-commerce Store Owner",
      company: "Wilson Goods",
      content: "My online store was struggling until I found Lovable. The e-commerce features are fantastic and my conversion rate has doubled. Best investment I've made for my business.",
      rating: 5,
      avatar: "JW"
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
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Loved by creators
            <span className="block gradient-text">worldwide</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our amazing community of creators
            has to say about building with Lovable.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-lovable-400 to-lovable-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-white transition-colors">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className="w-8 h-8 text-lovable-400 opacity-50 absolute -top-2 -left-2" />
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors italic pl-6">
                  "{testimonial.content}"
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">4.9/5</div>
            <div className="text-gray-400">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-gray-400">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">99%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-gray-400">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
