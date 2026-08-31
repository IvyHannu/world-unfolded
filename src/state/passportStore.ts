export interface PassportStoreRecord {
  destinationId: string;
  dateMarkedVisited: string;
  stampId: string;
}

export interface PassportStoreState {
  visitedRecords: readonly PassportStoreRecord[];
}

export interface PassportStoreActions {
  markVisited: (record: PassportStoreRecord) => void;
  removeVisited: (destinationId: string) => void;
}

export type PassportStoreShape = PassportStoreState & PassportStoreActions;
