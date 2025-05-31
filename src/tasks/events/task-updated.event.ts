export class TaskUpdatedEvent {
  constructor(
    public readonly taskId: string,
    public readonly updatedFields: Partial<{
      title: string;
      description: string;
      assignedTo: string;
      status: string;
      priority: string;
      dueDate?: Date;
      completedAt?: Date;
    }>,
  ) {}
}
