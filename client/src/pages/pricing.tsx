import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Check, X, Crown, Mail, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async (plan: string) => {
      return await apiRequest("POST", "/api/subscription/upgrade", { plan });
    },
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been upgraded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to upgrade subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for beginners",
      features: [
        "5 AI queries per day",
        "Basic market insights",
        "Email support",
      ],
      limitations: [
        "Real-time alerts",
        "Portfolio analysis",
      ],
      current: user?.subscription === "free",
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
        "Unlimited AI queries",
        "Advanced market analysis",
        "Real-time alerts",
        "Portfolio analysis",
        "Priority support",
      ],
      limitations: [],
      current: user?.subscription === "pro",
      buttonText: user?.subscription === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonDisabled: user?.subscription === "pro",
      plan: "pro",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For trading firms",
      features: [
        "Everything in Pro",
        "Custom AI models",
        "API access",
        "Team collaboration",
        "Dedicated support",
      ],
      limitations: [],
      current: user?.subscription === "enterprise",
      buttonText: user?.subscription === "enterprise" ? "Current Plan" : "Contact Sales",
      buttonDisabled: user?.subscription === "enterprise",
      plan: "enterprise",
    },
  ];

  const faqs = [
    {
      question: "How accurate are the AI predictions?",
      answer: "Our AI models achieve 85%+ accuracy in trend prediction by analyzing multiple data sources including market sentiment, technical indicators, and historical patterns."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing cycle."
    },
    {
      question: "Is my financial data secure?",
      answer: "We use bank-level encryption and never store sensitive financial information. All data is processed securely and in compliance with financial regulations."
    }
  ];

  const handleUpgrade = (plan: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    upgradeMutation.mutate(plan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Choose Your Trading Plan
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Unlock advanced AI insights and take your trading to the next level
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative hover:shadow-xl transition-all transform hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-blue-600 shadow-xl' : 'border border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-6 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-neutral-800 mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-neutral-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg text-neutral-600 font-normal">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="text-green-600 mr-3 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-center text-neutral-400">
                        <X className="mr-3 h-5 w-5" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 font-semibold ${
                      plan.current 
                        ? 'bg-gray-100 hover:bg-gray-200 text-neutral-800'
                        : plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    disabled={plan.buttonDisabled || upgradeMutation.isPending}
                    onClick={() => plan.plan && handleUpgrade(plan.plan)}
                  >
                    {plan.current && <Crown className="mr-2 h-4 w-4" />}
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center text-neutral-800 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-neutral-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
