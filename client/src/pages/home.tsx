import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { MessageSquare, TrendingUp, BarChart3, User } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Arthik.ai!
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to make some smart trading decisions today?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/chatbot")}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Start Trading Chat</CardTitle>
              <MessageSquare className="h-4 w-4 ml-auto text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Ask AI</div>
              <p className="text-xs text-muted-foreground">
                Get instant market insights and trading advice
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Overview</CardTitle>
              <TrendingUp className="h-4 w-4 ml-auto text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+2.4%</div>
              <p className="text-xs text-muted-foreground">
                S&P 500 is up today
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free to Use</CardTitle>
              <User className="h-4 w-4 ml-auto text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                No Login Required
              </div>
              <p className="text-xs text-muted-foreground">
                Start trading conversations immediately
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="text-center space-y-6">
          <Button 
            onClick={() => setLocation("/chatbot")}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start AI Chat
          </Button>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setLocation("/pricing")}>
              View Pricing
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/api/logout"}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
