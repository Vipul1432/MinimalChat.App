import { Component, HostListener, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { UserChat } from 'src/app/_shared/models/UserChat';
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
  selectedUserName: string = ''

  constructor(private chatService: ChatService,private ngZone: NgZone) {
    
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
          console.log(this.topTimestamp);         
          console.log(messages);
          
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

      console.log(messages);
    });
  }

  isSender(message: UserChat): boolean {
    return message.senderId === this.userId;
  }

  avatarStyle(name: string): any {
    const colors = ['#e91e63', '#009688', '#ff9800', '#673ab7', '#ff5722'];
    const initial = name.charAt(0).toUpperCase(); 
    const colorIndex = initial.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];  
    return { 'background-color': backgroundColor };
  }
}
