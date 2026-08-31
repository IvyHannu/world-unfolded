export interface SavedStoreRecord {
  subjectId: string;
  subjectType: 'destination' | 'discoveryItem';
  status: 'saved' | 'wantToGo';
  dateAdded: string;
}

export interface SavedStoreState {
  records: readonly SavedStoreRecord[];
}

export interface SavedStoreActions {
  setStatus: (record: SavedStoreRecord) => void;
  remove: (subjectId: string) => void;
}

export type SavedStoreShape = SavedStoreState & SavedStoreActions;
