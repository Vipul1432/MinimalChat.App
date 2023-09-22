import { Component, HostListener, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { UserChat } from 'src/app/_shared/models/UserChat';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ChatService } from 'src/app/_shared/services/chat.service';



@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnChanges {
  userChat: UserChat[] = [];
  topTimestamp:Date = new Date;
  @Input() userId: string = '';
  @Input() name: string = '';
  topPosToStartShowing = 100;
  isLoading!: boolean;
  selectedUserName: string = '';
  currentUserName: string | null = '';
  messageInput: string = '';

  constructor(private chatService: ChatService,private authService: AuthService) {
    this.currentUserName = this.authService.getUserName();
    console.log(this.currentUserName);   
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && !changes['userId'].firstChange) {

      if(changes['name'] && !changes['name'].firstChange) {
        this.selectedUserName = this.name;       
      }
      // Fetch user chat data using the new userId
      if (this.userId) {
        this.chatService.getUserChat(this.userId, null, null, null).subscribe((messages:any) => {
          this.userChat = messages.data || [];
          this.topTimestamp = this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
        });
      }
    }
  }
  @HostListener('window:scroll', ['$event'])
  checkScroll(event: Event) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
   
    if (scrollPosition <= 0 && !this.isLoading) {
      this.isLoading = true;
      this.fetchUserChat(this.topTimestamp);
    }
  }

  private fetchUserChat(topTimestamp: Date) {
    this.chatService.getUserChat(this.userId, topTimestamp, null, null).subscribe((messages: any) => {
      if (topTimestamp === null) {
        this.userChat = messages.data;
      } else {
        // Append the new messages to the existing ones
        this.userChat = [...messages.data, ...this.userChat];
      }

      // Update the top timestamp
      if (this.userChat.length > 0) {
        this.topTimestamp = this.userChat[0].timestamp;
      }
    });
  }

  isSender(message: UserChat): boolean {
    return message.senderId === this.userId;
  }

  sendMessage() {
    const content = this.messageInput.trim();
    if (content.trim() !== '') {
      // Check if the content is not empty or whitespace
      this.chatService.sendMessage(this.userId, content).subscribe((response: any) => {
        // Handle the response if needed
        if (response.statusCode === 200) {
          // Message sent successfully
          console.log('Message sent successfully:', response.data);
          this.chatService.getUserChat(this.userId, null, null, null).subscribe((messages:any) => {
            this.userChat = messages.data || [];
            this.topTimestamp = this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
            this.messageInput = '';
          });
        } else {
          // Handle any errors or show a notification to the user
          console.error('Failed to send message:', response.error);
        }
      });
    }
  }
}
