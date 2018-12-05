import { __current_task, __tasks } from "core/private";
import { Suru, Task, SuruBit } from "core";

export function TaskBuilder(taskDefFn: Function) {
  const task = new Task();

  const previousTask: Task | null = this[__current_task];
  this[__current_task] = task;

  taskDefFn();

  this[__current_task] = previousTask;

  task.pipeline.forEach((bit: SuruBit) => {
    if (!(bit instanceof SuruBit)) {
      throw new Error(
        `Unknown element in task pipeline !\n${JSON.stringify(bit, null, 3)}`
      );
    }

    bit.buildTask(task);
  });

  if (
    !task.name ||
    typeof task.name !== "string" ||
    task.name.trim().length < 1
  ) {
    throw new Error(
      `Task name should be a non-empty string! Got: ${task.name}`
    );
  }

  if (typeof task.run !== "function") {
    throw new Error(`Task run should be a function`);
  }

  this[__tasks][task.name] = task;

  return task.runFn.bind(task);
}
