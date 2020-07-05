export type WorkerUsage = {
  [workerPID: number]: {
    routerCount: number;
  };
};
