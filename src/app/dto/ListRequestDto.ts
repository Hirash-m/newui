
export class ListRequest {
  pageNumber: number = 1;
  pageSize: number = 1;
  sortBy: string = 'id';
  sortDirection: boolean = true;

  constructor(init?: Partial<ListRequest>) {
    Object.assign(this, init);
  }
}
