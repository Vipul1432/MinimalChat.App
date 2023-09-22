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
  i: number = 0;

  constructor(
    private userService: UserService, 
    private toasterService: NgToastService,
    ) {} 

  ngOnInit() {
    // Fetch all users
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.users = response.data;
          this.generateRandomNumber(this.users.length)
          this.users.forEach(() => {
            this.userBackgroundColors = this.generateRandomColors(this.users.length);
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
  generateRandomColors(count: number): string[] {
    const randomColors: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      randomColors.push(this.colors[randomIndex]);
    }
    return randomColors;
  }
  generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }
  
  onUserClick(userId: string, name: string): void {
    this.userClicked.emit({ userId, name});
  }
}
