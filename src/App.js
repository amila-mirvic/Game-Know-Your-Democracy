import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { GameProvider } from "./app/GameProvider";

import WelcomeScreen from "./screens/Welcome/WelcomeScreen";
import SetupScreen from "./screens/Setup/SetupScreen";
import WorldSelectorScreen from "./screens/WorldSelector/WorldSelectorScreen";
import World1TaskSelectorScreen from "./screens/World1TaskSelector/World1TaskSelectorScreen";

import World1Task1IntroScreen from "./screens/World1Task1Intro/World1Task1IntroScreen";
import World1Task1Screen from "./screens/World1Task1/World1Task1Screen";

import World1Task2IntroScreen from "./screens/World1Task2Intro/World1Task2IntroScreen";
import World1Task2Screen from "./screens/World1Task2/World1Task2Screen";

import World1Task3IntroScreen from "./screens/World1Task3Intro/World1Task3IntroScreen";
import World1Task3Screen from "./screens/World1Task3/World1Task3Screen";

import World1Task4IntroScreen from "./screens/World1Task4Intro/World1Task4IntroScreen";
import World1Task4InstructionsScreen from "./screens/World1Task4Instructions/World1Task4InstructionsScreen";
import World1Task4Screen from "./screens/World1Task4/World1Task4Screen";

import TaskRunnerScreen from "./screens/TaskRunner/TaskRunnerScreen";

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<SetupScreen />} />
          <Route path="/world-select" element={<WorldSelectorScreen />} />
          <Route path="/world-1" element={<World1TaskSelectorScreen />} />

          {/* Task 1 */}
          <Route path="/world-1/task-1-intro" element={<World1Task1IntroScreen />} />
          <Route path="/world-1/task-1" element={<World1Task1Screen />} />

          {/* Task 2 (NEW flow) */}
          <Route path="/world-1/task-2-intro" element={<World1Task2IntroScreen />} />
          <Route path="/world-1/task-2" element={<World1Task2Screen />} />

          {/* Task 3 */}
          <Route path="/world-1/task-3-intro" element={<World1Task3IntroScreen />} />
          <Route path="/world-1/task-3" element={<World1Task3Screen />} />

          {/* Task 4 */}
          <Route path="/world-1/task-4-intro" element={<World1Task4IntroScreen />} />
          <Route path="/world-1/task-4-instructions" element={<World1Task4InstructionsScreen />} />
          <Route path="/world-1/task-4" element={<World1Task4Screen />} />

          {/* optional runner */}
          <Route path="/world-1/task/:taskId" element={<TaskRunnerScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}