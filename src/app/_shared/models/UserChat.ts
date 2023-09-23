export interface UserChat {
    id:number;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp:Date;
    editedContent?: string; // For edited messages
    isEditing?: boolean;
  }