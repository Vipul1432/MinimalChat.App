export interface UserChat {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  gifUrls: string;
  editedContent?: string;
  isEditing?: boolean;
}
