export class GetTaskByIdQuery {
  constructor(
    public readonly id: string,
    public readonly currentUserId: string,
  ) {}
}
