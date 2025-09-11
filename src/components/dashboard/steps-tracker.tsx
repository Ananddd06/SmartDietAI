"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target } from "lucide-react";

interface StepsTrackerProps {
  currentSteps: number;
}

export function StepsTracker({ currentSteps }: StepsTrackerProps) {
  const dailyGoal = 10000;
  const progress = (currentSteps / dailyGoal) * 100;
  const isCompleted = currentSteps >= dailyGoal;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Daily Goal</span>
        </div>
        <Badge variant={isCompleted ? "default" : "secondary"}>
          {isCompleted ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completed
            </div>
          ) : (
            `${Math.round(dailyGoal - currentSteps)} to go`
          )}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{currentSteps.toLocaleString()} steps</span>
          <span>{dailyGoal.toLocaleString()} steps</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-gray-500 text-center">
          {progress.toFixed(1)}% of daily goal
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Milestones</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { steps: 2500, label: "25%", color: "bg-red-500" },
            { steps: 5000, label: "50%", color: "bg-yellow-500" },
            { steps: 7500, label: "75%", color: "bg-blue-500" },
            { steps: 10000, label: "100%", color: "bg-green-500" },
          ].map((milestone) => (
            <div
              key={milestone.steps}
              className={`text-center p-2 rounded-lg border ${
                currentSteps >= milestone.steps
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="text-xs font-medium">{milestone.label}</div>
              <div className="text-xs text-gray-500">
                {milestone.steps.toLocaleString()}
              </div>
              {currentSteps >= milestone.steps && (
                <CheckCircle className="h-3 w-3 text-green-600 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Take a 10-minute walk every 2 hours</li>
          <li>• Use stairs instead of elevator</li>
          <li>• Park farther away from entrances</li>
          <li>• Walk while talking on the phone</li>
        </ul>
      </div>
    </div>
  );
}