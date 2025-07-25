import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Crown, Mail, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const { toast } = useToast();

  const handleUpgrade = (plan: string) => {
    toast({
      title: "Demo Mode",
      description: "This is a demo version. All features are available for free!",
    });
  };

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for beginners",
      features: [
        "Unlimited AI queries",
        "Basic market insights",
        "Chat history",
        "Email support",
      ],
      limitations: [],
      current: true,
      buttonText: "Current Plan",
      buttonDisabled: true,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For serious traders",
      popular: true,
      features: [
        "Everything in Basic",
        "Advanced market analysis",
        "Real-time alerts",
        "Portfolio tracking",
        "Priority support",
      ],
      limitations: [],
      current: false,
      buttonText: "Coming Soon",
      buttonDisabled: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For professional teams",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Team collaboration",
        "Advanced analytics",
        "Dedicated support",
        "API access",
      ],
      limitations: [],
      current: false,
      buttonText: "Coming Soon",
      buttonDisabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your trading needs. Start for free, upgrade when ready.
            </p>
          </motion.div>
        </div>

        {/* Notice Banner */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-blue-600 border-blue-700 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                  <h3 className="text-xl font-semibold mb-2">Demo Mode Active</h3>
                  <p className="text-blue-100">
                    You're currently using the demo version with full access to all features. 
                    No payment required, no login needed!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Crown className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-center">
                        <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6">
                    <Button
                      onClick={() => handleUpgrade(plan.name.toLowerCase())}
                      disabled={plan.buttonDisabled}
                      className={`w-full h-12 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : plan.current
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 hover:bg-gray-900 text-white'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is this really free?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Yes! This is a demo version with full access to all AI trading features. 
                    No credit card required, no hidden fees.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need to create an account?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    No registration required! You can start using the AI trading assistant immediately. 
                    Your chat history is stored locally during your session.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What kind of trading advice do you provide?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Our AI provides educational information about trading strategies, market analysis, 
                    and investment principles. Remember: this is for educational purposes only, not financial advice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}