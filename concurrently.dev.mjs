import concurrently from "concurrently";

concurrently(
  [
    "npm:dev-*",
    {
      name: "backend",
      command: "yarn dev",
      cwd: "./backend",
    },
    {
      name: "frontend",
      command: "yarn dev",
      cwd: "./frontend",
    },
  ],
  {
    prefix: "name",
    restartTries: 3,
    killOthers: ["failure", "success"],
    cwd: ".",
  }
);
