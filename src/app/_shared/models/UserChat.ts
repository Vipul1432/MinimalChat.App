export interface UserChat {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  editedContent?: string;
  isEditing?: boolean;
}
