import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/_shared/models/User';
import { UserService } from 'src/app/_shared/services/user.service';
import { NgToastService } from 'ng-angular-popup'; 

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit { 
  @Input() users: User[] = [];
  @Output() userClicked: EventEmitter<{ userId: string, name: string }> = new EventEmitter<{ userId: string, name: string }>();

  userBackgroundColors: string[] = [];
  colors: string[] = ['#000000', '#e91e63', '#009688', '#ff9800', '#673ab7', '#ff5722'];
  constructor(
    private userService: UserService, 
    private toasterService: NgToastService,
    ) {} 

  ngOnInit() {
    // Fetch all users
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.users = response.data; // Assign the users from the response
          this.users.forEach(() => {
            this.userBackgroundColors.push(this.generateRandomColor());
          });
          this.toasterService.success({
            detail: "SUCCESS",
            summary: `Users fetched successfully`,
            duration: 5000
          });
        } else {
          this.toasterService.error({
            detail: "ERROR",
            summary: "Failed to fetch users",
            sticky: true
          });
        }
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        this.toasterService.error({
          detail: "ERROR",
          summary: "Failed to fetch users",
          sticky: true
        });
      }
    );
  }
  generateRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  onUserClick(userId: string, name: string): void {
    this.userClicked.emit({ userId, name});
  }
}
